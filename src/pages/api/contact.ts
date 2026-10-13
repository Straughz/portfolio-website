import type { APIRoute } from 'astro';
import { createHash, randomBytes } from 'node:crypto';
import { createContactMail, sendWithResend, type SendMail } from '../../lib/contact-email';
import { clientIpFrom, createGuard, fingerprint, issueToken, verifyToken, type Guard } from '../../lib/contact-guard';
import { validateContactInput } from '../../lib/contact-validation';

export { createGuard, issueToken } from '../../lib/contact-guard';

export const prerender = false;

type Config = { key?: string; to?: string; from?: string; production: boolean };
type Dependencies = {
  send?: SendMail;
  readConfig?: () => Config;
  log?: (event: { event: string; outcome: string }) => void;
  guard?: Guard;
  tokenSecret?: string;
  now?: () => number;
};

function runtimeConfig(): Config {
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
  return {
    key: env?.RESEND_API_KEY,
    to: env?.CONTACT_TO_EMAIL,
    from: env?.CONTACT_FROM_EMAIL,
    production: import.meta.env.PROD,
  };
}

// One guard and one signing secret per server process. The secret follows the mail
// key so tokens survive a container restart; without a key it is random per boot.
const processGuard = createGuard();
const bootSecret = randomBytes(32).toString('hex');
function runtimeSecret(): string {
  const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env;
  const explicit = env?.CONTACT_TOKEN_SECRET?.trim();
  if (explicit) return explicit;
  const key = env?.RESEND_API_KEY?.trim();
  return key ? createHash('sha256').update(`nvg-contact-token:${key}`).digest('hex') : bootSecret;
}

const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const address = (value: string) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);

async function readBoundedJson(request: Request): Promise<unknown> {
  if (!request.body) throw new Error('empty_body');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) throw new Error('body_too_large');
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export function handleTokenRequest(dependencies: Dependencies = {}): Response {
  const now = dependencies.now ?? Date.now;
  return json({ token: issueToken(dependencies.tokenSecret ?? runtimeSecret(), now()) });
}

export async function handleContactRequest(request: Request, dependencies: Dependencies = {}): Promise<Response> {
  const log = dependencies.log ?? ((event: { event: string; outcome: string }) => console.info(JSON.stringify(event)));
  const now = dependencies.now ?? Date.now;
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Send the form as JSON.' }, 415);
  }

  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch {
    return json({ error: 'Check the form details and try again.' }, 400);
  }

  const validated = validateContactInput(body);
  if (!validated.ok) return json({ error: 'Check the marked fields and try again.', fields: validated.errors }, 400);
  if (validated.honeypot) return json({ ok: true });

  // The form token proves the ticket came through the page and took a person's time.
  const token = typeof body === 'object' && body !== null ? (body as Record<string, unknown>)._t : undefined;
  const tokenVerdict = verifyToken(dependencies.tokenSecret ?? runtimeSecret(), token, now());
  if (tokenVerdict !== 'ok') {
    log({ event: 'contact_send', outcome: `token_${tokenVerdict}` });
    return json({ error: 'The form needs a moment before it can send. Please try again.', code: 'token' }, 400);
  }

  const guard = dependencies.guard ?? processGuard;
  const verdict = guard.check(clientIpFrom(request.headers), fingerprint(validated.value.email, validated.value.message), now());
  if (verdict === 'duplicate') {
    log({ event: 'contact_send', outcome: 'duplicate' });
    return json({ ok: true });
  }
  if (verdict === 'rate_limited') {
    log({ event: 'contact_send', outcome: 'rate_limited' });
    return json({ error: 'Too many tickets from this connection for now. Please try again later.' }, 429);
  }

  const config = (dependencies.readConfig ?? runtimeConfig)();
  const key = config.key?.trim();
  const to = config.to?.trim();
  // The demo sender is allowed only for a local development contingency.
  const from = config.from?.trim() || (config.production ? '' : 'Nexus Vantage <onboarding@resend.dev>');
  const fromAddress = from.match(/<([^<>]+)>$/)?.[1] ?? from;
  // A verified sender on the studio's own domain, root or subdomain; the demo sender never ships.
  const senderIsProductionReady = !/\bonboarding@resend\.dev$/i.test(fromAddress) &&
    /@[^@\s]+\.[^@.\s]{2,}$/.test(fromAddress);
  if (!key || !to || !address(to) || !address(fromAddress) || (config.production && !senderIsProductionReady)) {
    log({ event: 'contact_send', outcome: 'configuration_missing' });
    return json({ error: 'I could not send the ticket right now. Please try again later.' }, 503);
  }

  try {
    const result = await (dependencies.send ?? sendWithResend)(key, createContactMail(validated.value, from, to));
    if (result.error || !result.data?.id) {
      log({ event: 'contact_send', outcome: 'provider_rejected' });
      return json({ error: 'I could not send the ticket right now. Please try again later.' }, 502);
    }
    log({ event: 'contact_send', outcome: 'accepted' });
    return json({ ok: true });
  } catch {
    log({ event: 'contact_send', outcome: 'send_failed' });
    return json({ error: 'I could not send the ticket right now. Please try again later.' }, 502);
  }
}

export const GET: APIRoute = () => handleTokenRequest();
export const POST: APIRoute = ({ request }) => handleContactRequest(request);
