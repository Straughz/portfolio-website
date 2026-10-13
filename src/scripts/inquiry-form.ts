import { CONTACT_LIMITS, countWords, validateContactInput, type ContactField } from '../lib/contact-validation';

// The server signs a form token and refuses tickets sent before it is this old.
const TOKEN_MIN_AGE_MS = 3_200;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

for (const root of document.querySelectorAll<HTMLElement>('[data-inquiry-form]')) {
  const form = root.querySelector<HTMLFormElement>('form');
  const status = root.querySelector<HTMLElement>('[data-inquiry-status]');
  const summary = root.querySelector<HTMLElement>('[data-inquiry-summary]');
  const indicator = root.querySelector<HTMLElement>('[data-waiting-indicator]');
  const counter = root.querySelector<HTMLElement>('[data-word-count]');
  const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = submit?.querySelector<HTMLElement>('[data-submit-label]');
  if (!form || !status || !summary || !indicator || !submit || !submitLabel) continue;

  const setStatus = (message: string, state = '') => {
    status.textContent = message;
    status.dataset.state = state;
  };

  const fields = ['name', 'email', 'phone', 'message'] as const;
  type FormField = (typeof fields)[number];
  const inputFor = (name: FormField) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const errorFor = (name: ContactField) => form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);

  // Form token: fetched once a person starts on the form, aged before use, renewed on demand.
  let token = '';
  let issuedAt = 0;
  let tokenRequest: Promise<void> | null = null;
  function fetchToken(): Promise<void> {
    tokenRequest ??= fetch('/api/contact', { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        if (data && typeof data === 'object' && typeof (data as { token?: unknown }).token === 'string') {
          token = (data as { token: string }).token;
          issuedAt = Date.now();
        }
      })
      .catch(() => {})
      .finally(() => { tokenRequest = null; });
    return tokenRequest;
  }
  async function readyToken(): Promise<string> {
    if (!token) await fetchToken();
    const wait = TOKEN_MIN_AGE_MS - (Date.now() - issuedAt);
    if (token && wait > 0) await delay(wait);
    return token;
  }
  form.addEventListener('focusin', () => { if (!token && !tokenRequest) void fetchToken(); }, { once: true });

  const values = () => ({
    name: inputFor('name').value,
    email: inputFor('email').value,
    phone: inputFor('phone').value,
    message: inputFor('message').value,
    intent: new URLSearchParams(window.location.search).get('intent') ?? 'general',
    _hp: (form.elements.namedItem('_hp') as HTMLInputElement).value,
    _t: token,
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

  function updateCounter() {
    if (!counter) return;
    const words = countWords(inputFor('message').value);
    counter.textContent = `${words} / ${CONTACT_LIMITS.words} words`;
    counter.dataset.over = words > CONTACT_LIMITS.words ? 'true' : 'false';
  }
  updateCounter();

  for (const name of fields) {
    inputFor(name).addEventListener('blur', () => checkField(name));
    inputFor(name).addEventListener('input', () => {
      if (name === 'message') updateCounter();
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
    submit!.disabled = false;
    submitLabel!.textContent = 'Send the ticket';
  }
  window.addEventListener('pagehide', abortSend);
  document.addEventListener('astro:before-swap', abortSend);

  async function post(payload: ReturnType<typeof values>, signal: AbortSignal, retried = false): Promise<Response> {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, _t: await readyToken() }),
      signal,
    });
    if (response.status === 400 && !retried) {
      const data: unknown = await response.clone().json().catch(() => null);
      if (data && typeof data === 'object' && (data as { code?: unknown }).code === 'token') {
        token = '';
        await fetchToken();
        return post(payload, signal, true);
      }
    }
    return response;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (controller) return;
    setStatus('');
    summary.textContent = '';
    const payload = values();
    const result = validateContactInput(payload);
    if (!result.ok) {
      for (const name of fields) showError(name, result.errors[name] ?? '');
      summary.textContent = 'Check the marked fields and try again.';
      fields.find((name) => result.errors[name]) && inputFor(fields.find((name) => result.errors[name])!).focus();
      return;
    }
    for (const name of fields) showError(name);
    controller = new AbortController();
    const active = controller;
    submit.disabled = true;
    submitLabel.textContent = 'Sending...';
    setStatus('Sending your ticket.', 'waiting');
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
      const response = await post(payload, active.signal);
      if (active.signal.aborted) return;
      if (!response.ok) {
        const data: unknown = await response.json().catch(() => null);
        if (response.status === 400 && data && typeof data === 'object' && 'fields' in data) {
          const serverFields = (data as { fields: Partial<Record<FormField, string>> }).fields;
          for (const name of fields) if (typeof serverFields?.[name] === 'string') showError(name, serverFields[name]);
        }
        if (response.status === 429) {
          setStatus('Too many tickets from this connection for now. Your details are still here. Please try again later.', 'failure');
          return;
        }
        setStatus('I could not send the ticket. Your details are still here. Please try again.', 'failure');
        return;
      }
      setStatus('Your ticket was accepted by the server. I will read it and get back to you.', 'success');
    } catch {
      if (!active.signal.aborted) setStatus('I could not send the ticket. Your details are still here. Check your connection and try again.', 'failure');
    } finally {
      if (controller === active) controller = null;
      submit.disabled = false;
      submitLabel.textContent = 'Send the ticket';
      clearWait();
    }
  });
}
