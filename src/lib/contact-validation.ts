import { validateScope, type ServiceLabel } from './services';

export const CONTACT_LIMITS = { name: 120, email: 254, phone: 30, message: 3000 } as const;

export type ContactField = 'name' | 'email' | 'phone' | 'message' | 'scope';
export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  scope: ServiceLabel[];
  intent: 'general' | 'strategy' | 'conversation';
};

type ValidationResult =
  | { ok: true; value: ContactInput; honeypot: boolean }
  | { ok: false; errors: Partial<Record<ContactField, string>> };

const EMAIL_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
const INTENTS = ['general', 'strategy', 'conversation'] as const;

export function validateContactInput(input: unknown): ValidationResult {
  const errors: Partial<Record<ContactField, string>> = {};
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: { message: 'Enter your inquiry details.' } };
  }

  const body = input as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim().replace(/\s+/g, ' ') : '';
  const message = typeof body.message === 'string' ? body.message.trim().replace(/\r\n?/g, '\n') : '';

  if (!name) errors.name = 'Enter your name.';
  else if (name.length > CONTACT_LIMITS.name) errors.name = 'Keep your name under 120 characters.';
  if (!email || !EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email || /[\r\n\x00-\x1f\x7f]/.test(email)) {
    errors.email = 'Enter a valid email address under 254 characters.';
  }
  if (phone.length > CONTACT_LIMITS.phone || /[\x00-\x1f\x7f]/.test(phone)) {
    errors.phone = 'Keep the phone number under 30 characters.';
  }
  if (!message) errors.message = 'Describe your project or question.';
  else if (message.length > CONTACT_LIMITS.message) errors.message = 'Keep your details under 3000 characters.';

  const rawScope = body.scope === undefined ? [] : body.scope;
  const scope = Array.isArray(rawScope) && rawScope.length <= 5 ? validateScope(rawScope) : null;
  if (scope === null) errors.scope = 'Choose only the listed services, or leave scope open.';

  // Legacy /contact?intent= links retain their subject meaning without making a required field.
  const intent = INTENTS.find((item) => item === body.intent) ?? 'general';
  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    honeypot: typeof body._hp === 'string' && body._hp.trim().length > 0,
    value: { name, email, phone, message, scope: scope!, intent },
  };
}
