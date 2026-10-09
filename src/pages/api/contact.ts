import type { APIRoute } from 'astro';
import { createContactMail, sendWithResend, type SendMail } from '../../lib/contact-email';
import { validateContactInput } from '../../lib/contact-validation';

export const prerender = false;

type Config = { key?: string; to?: string; from?: string; production: boolean };
type Dependencies = {
  send?: SendMail;
  readConfig?: () => Config;
  log?: (event: { event: string; outcome: string }) => void;
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

const json = (body: object, status = 200) => Response.json(body, { status });
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

export async function handleContactRequest(request: Request, dependencies: Dependencies = {}): Promise<Response> {
  const log = dependencies.log ?? ((event: { event: string; outcome: string }) => console.info(JSON.stringify(event)));
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

  const config = (dependencies.readConfig ?? runtimeConfig)();
  const key = config.key?.trim();
  const to = config.to?.trim();
  // The demo sender is allowed only for a local development contingency.
  const from = config.from?.trim() || (config.production ? '' : 'Nexus Vantage <onboarding@resend.dev>');
  const fromAddress = from.match(/<([^<>]+)>$/)?.[1] ?? from;
  const senderIsProductionReady = !/\bonboarding@resend\.dev$/i.test(fromAddress) &&
    /@[^@.]+\.[^@.]+\.[^@.]+$/.test(fromAddress);
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

export const POST: APIRoute = ({ request }) => handleContactRequest(request);
