import { EMPTY_SCOPE_LABEL } from './services';
import type { ContactInput } from './contact-validation';

export type Mail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
};

export type SendMail = (key: string, mail: Mail) => Promise<{ data?: { id: string } | null; error?: unknown | null }>;

const INTENT_LABELS = {
  general: 'General inquiry',
  strategy: 'Strategy call request',
  conversation: 'Project conversation',
} as const;

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

export function createContactMail(input: ContactInput, from: string, to: string): Mail {
  const intent = INTENT_LABELS[input.intent];
  const scope = input.scope.length ? input.scope.join(', ') : EMPTY_SCOPE_LABEL;
  const phone = input.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>` : '';
  return {
    from,
    to,
    replyTo: input.email,
    subject: `[NVG] ${intent}: ${input.name}`,
    html: [
      `<h2>${escapeHtml(intent)}</h2>`,
      `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>`,
      phone,
      `<p><strong>Scope:</strong> ${escapeHtml(scope)}</p>`,
      '<hr />',
      `<p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>`,
    ].filter(Boolean).join('\n'),
  };
}

export async function sendWithResend(key: string, mail: Mail): Promise<{ data?: { id: string } | null; error?: unknown | null }> {
  const { Resend } = await import('resend');
  const resend = new Resend(key);
  return resend.emails.send(mail);
}
