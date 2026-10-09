import { validateContactInput, type ContactField } from '../lib/contact-validation';
import {
  getSelectedScope,
  initialScopeForPage,
  scopeSummary,
  SCOPE_CHANGE_EVENT,
  type ScopeChangeDetail,
} from '../lib/scope-state';
import { validateScope, type ServiceLabel } from '../lib/services';

for (const root of document.querySelectorAll<HTMLElement>('[data-inquiry-form]')) {
  const form = root.querySelector<HTMLFormElement>('form');
  const summary = root.querySelector<HTMLElement>('[data-inquiry-scope]');
  const status = root.querySelector<HTMLElement>('[data-inquiry-status]');
  const indicator = root.querySelector<HTMLElement>('[data-waiting-indicator]');
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!form || !summary || !status || !indicator || !submit) continue;

  let scope: ServiceLabel[] = initialScopeForPage();
  try {
    const given: unknown = JSON.parse(root.dataset.initialScope ?? '[]');
    if (!scope.length && Array.isArray(given)) scope = validateScope(given) ?? [];
  } catch { /* The default empty scope is valid. */ }
  if (window.location.pathname.replace(/\/$/, '') !== '/contact' && getSelectedScope().length) scope = getSelectedScope();
  summary.textContent = scopeSummary(scope);

  function onScopeChange(event: Event) {
    const detail = (event as CustomEvent<ScopeChangeDetail>).detail;
    const valid = validateScope(detail?.labels ?? []);
    if (valid === null) return;
    scope = valid;
    summary!.textContent = scopeSummary(scope);
  }
  window.addEventListener(SCOPE_CHANGE_EVENT, onScopeChange);

  const fields = ['name', 'email', 'phone', 'message'] as const;
  type FormField = (typeof fields)[number];
  const inputFor = (name: FormField) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const errorFor = (name: ContactField) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
  const values = () => ({
    name: inputFor('name').value,
    email: inputFor('email').value,
    phone: inputFor('phone').value,
    message: inputFor('message').value,
    scope,
    intent: new URLSearchParams(window.location.search).get('intent') ?? 'general',
    _hp: (form.elements.namedItem('_hp') as HTMLInputElement).value,
  });

  function showError(name: FormField, message = '') {
    const input = inputFor(name);
    const error = errorFor(name);
    if (error) error.textContent = message;
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function checkField(name: FormField, clearOnly = false) {
    const result = validateContactInput(values());
    const message = result.ok ? '' : result.errors[name] ?? '';
    if (!clearOnly || !message) showError(name, message);
  }

  for (const name of fields) {
    inputFor(name).addEventListener('blur', () => checkField(name));
    inputFor(name).addEventListener('input', () => {
      if (inputFor(name).hasAttribute('aria-invalid')) checkField(name, true);
    });
  }

  let controller: AbortController | null = null;
  let waitTimer: ReturnType<typeof setTimeout> | undefined;
  function clearWait() {
    if (waitTimer !== undefined) clearTimeout(waitTimer);
    waitTimer = undefined;
    indicator!.hidden = true;
    indicator!.setAttribute('aria-hidden', 'true');
  }
  function abortSend() {
    controller?.abort();
    controller = null;
    clearWait();
  }
  window.addEventListener('pagehide', abortSend);
  document.addEventListener('astro:before-swap', abortSend);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (controller) return;
    status.textContent = '';
    const payload = values();
    const result = validateContactInput(payload);
    if (!result.ok) {
      for (const name of fields) showError(name, result.errors[name] ?? '');
      status.textContent = 'Check the marked fields and try again.';
      fields.find((name) => result.errors[name]) && inputFor(fields.find((name) => result.errors[name])!).focus();
      return;
    }
    for (const name of fields) showError(name);
    controller = new AbortController();
    const active = controller;
    submit.disabled = true;
    status.textContent = 'Sending your ticket.';
    waitTimer = setTimeout(() => {
      if (controller === active && !active.signal.aborted) {
        for (const image of indicator.querySelectorAll<HTMLImageElement>('img[data-src]')) {
          image.src = image.dataset.src ?? '';
          delete image.dataset.src;
        }
        indicator.hidden = false;
        indicator.setAttribute('aria-hidden', 'false');
      }
    }, 400);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: active.signal,
      });
      if (active.signal.aborted) return;
      if (!response.ok) {
        if (response.status === 400) {
          const data: unknown = await response.json();
          if (data && typeof data === 'object' && 'fields' in data) {
            const serverFields = (data as { fields: Partial<Record<FormField, string>> }).fields;
            for (const name of fields) if (typeof serverFields?.[name] === 'string') showError(name, serverFields[name]);
          }
        }
        status.textContent = 'I could not send the ticket. Your details are still here. Please try again.';
        return;
      }
      status.textContent = 'Your ticket was accepted by the server. I will read it and get back to you.';
    } catch {
      if (!active.signal.aborted) status.textContent = 'I could not send the ticket. Your details are still here. Check your connection and try again.';
    } finally {
      if (controller === active) controller = null;
      submit.disabled = false;
      clearWait();
    }
  });
}
