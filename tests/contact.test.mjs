import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';

// Bundle local TS modules in memory. The Resend import remains lazy and these tests
// always inject a fake send, so no provider client is constructed or called.
const bundled = await build({
  entryPoints: ['src/pages/api/contact.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  write: false,
});
const { handleContactRequest } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

const config = () => ({
  key: 'test-key',
  to: 'recipient@example.com',
  from: 'Nexus Vantage <hello@mail.example.com>',
  production: true,
});
const payload = (overrides = {}) => ({
  name: 'Ada Example', email: 'ada@example.com', phone: '',
  message: 'I need a website.', scope: ['Website'], _hp: '', ...overrides,
});
const request = (body) => new Request('http://localhost/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const silent = () => {};

test('accepted payload sends once and returns success only after acceptance', async () => {
  let accept;
  const pending = new Promise((resolve) => { accept = resolve; });
  const sent = [];
  const result = handleContactRequest(request(payload()), {
    readConfig: config, log: silent,
    send: async (_key, mail) => { sent.push(mail); return pending; },
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(sent.length, 1);
  let settled = false;
  result.then(() => { settled = true; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false);
  accept({ data: { id: 'mock-accepted' }, error: null });
  const response = await result;
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.match(sent[0].html, /Website/);
});

test('empty scope remains a valid inquiry', async () => {
  let html = '';
  const response = await handleContactRequest(request(payload({ scope: [] })), {
    readConfig: config, log: silent,
    send: async (_key, mail) => { html = mail.html; return { data: { id: 'mock-accepted' }, error: null }; },
  });
  assert.equal(response.status, 200);
  assert.match(html, /scope to discuss/);
});

test('invalid JSON and invalid fields return 400 without sending', async () => {
  let calls = 0;
  const deps = { readConfig: config, log: silent, send: async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; } };
  assert.equal((await handleContactRequest(request('{bad'), deps)).status, 400);
  const response = await handleContactRequest(request(payload({ name: '', email: 'bad', message: '', scope: ['Other'] })), deps);
  assert.equal(response.status, 400);
  const json = await response.json();
  assert.ok(json.fields.name && json.fields.email && json.fields.message && json.fields.scope);
  assert.equal(calls, 0);
});

test('visitor HTML in name, phone, message, and scope is encoded or rejected', async () => {
  let mail;
  const response = await handleContactRequest(request(payload({
    name: '<img src=x onerror=alert(1)>',
    phone: '<b>555</b>',
    message: '<script>alert("x")</script> & more',
  })), { readConfig: config, log: silent, send: async (_key, item) => { mail = item; return { data: { id: 'mock-accepted' }, error: null }; } });
  assert.equal(response.status, 200);
  assert.doesNotMatch(mail.html, /<script>|<img|<b>555<\/b>/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.html, /&lt;img/);
  assert.match(mail.html, /&lt;b&gt;555/);
  assert.match(mail.html, /&amp; more/);
  assert.equal((await handleContactRequest(request(payload({ scope: ['<script>'] })), {
    readConfig: config, log: silent, send: async () => { throw Error('must not send'); },
  })).status, 400);
});

test('honeypot reports success without touching config or provider', async () => {
  const response = await handleContactRequest(request(payload({ _hp: 'bot' })), {
    readConfig: () => { throw Error('must not read config'); },
    send: async () => { throw Error('must not send'); }, log: silent,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test('provider failure returns a generic non-success response', async () => {
  const response = await handleContactRequest(request(payload()), {
    readConfig: config, log: silent, send: async () => ({ error: { message: 'provider detail' } }),
  });
  assert.equal(response.status, 502);
  assert.doesNotMatch(JSON.stringify(await response.json()), /provider detail/);
});

test('missing key and missing production sender fail without sending', async () => {
  let calls = 0;
  const send = async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; };
  const missingKey = await handleContactRequest(request(payload()), {
    readConfig: () => ({ ...config(), key: '' }), send, log: silent,
  });
  const demoSender = await handleContactRequest(request(payload()), {
    readConfig: () => ({ ...config(), from: 'Nexus Vantage <onboarding@resend.dev>' }), send, log: silent,
  });
  assert.equal(missingKey.status, 503);
  assert.equal(demoSender.status, 503);
  assert.equal(calls, 0);
});
