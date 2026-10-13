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
const { handleContactRequest, handleTokenRequest, createGuard, issueToken } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const guardBundle = await build({
  entryPoints: ['src/lib/contact-guard.ts'], bundle: true, platform: 'node',
  format: 'esm', write: false,
});
const { GUARD_LIMITS, verifyToken, clientIpFrom } = await import(`data:text/javascript;base64,${Buffer.from(guardBundle.outputFiles[0].text).toString('base64')}`);
const NOW = 1_700_000_000_000;

const config = () => ({
  key: 'test-key',
  to: 'recipient@example.com',
  from: 'Nexus Vantage <hello@mail.example.com>',
  production: true,
});
const payload = (overrides = {}) => ({
  name: 'Ada Example', email: 'ada@example.com', phone: '',
  message: 'I need a website.', scope: ['Website'], _hp: '',
  _t: issueToken('test-secret', NOW - 5_000), ...overrides,
});
const request = (body, headers = {}) => new Request('http://localhost/api/contact', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const silent = () => {};
const dependencies = (overrides = {}) => ({
  tokenSecret: 'test-secret', guard: createGuard(), now: () => NOW,
  readConfig: config, log: silent, ...overrides,
});

test('accepted payload sends once and returns success only after acceptance', async () => {
  let accept;
  const pending = new Promise((resolve) => { accept = resolve; });
  const sent = [];
  const result = handleContactRequest(request(payload()), dependencies({
    send: async (_key, mail) => { sent.push(mail); return pending; },
  }));
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
  const response = await handleContactRequest(request(payload({ scope: [] })), dependencies({
    send: async (_key, mail) => { html = mail.html; return { data: { id: 'mock-accepted' }, error: null }; },
  }));
  assert.equal(response.status, 200);
  assert.match(html, /scope to discuss/);
});

test('contact form payload without scope remains a valid inquiry', async () => {
  let calls = 0;
  const response = await handleContactRequest(request(payload({ scope: undefined })), dependencies({
    send: async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; },
  }));
  assert.equal(response.status, 200);
  assert.equal(calls, 1);
});

test('invalid JSON and invalid fields return 400 without sending', async () => {
  let calls = 0;
  const deps = dependencies({ send: async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; } });
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
  })), dependencies({ send: async (_key, item) => { mail = item; return { data: { id: 'mock-accepted' }, error: null }; } }));
  assert.equal(response.status, 200);
  assert.doesNotMatch(mail.html, /<script>|<img|<b>555<\/b>/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.html, /&lt;img/);
  assert.match(mail.html, /&lt;b&gt;555/);
  assert.match(mail.html, /&amp; more/);
  assert.equal((await handleContactRequest(request(payload({ scope: ['<script>'] })), dependencies({
    send: async () => { throw Error('must not send'); },
  }))).status, 400);
});

test('honeypot reports success without touching config or provider', async () => {
  const response = await handleContactRequest(request(payload({ _hp: 'bot', _t: undefined })), dependencies({
    readConfig: () => { throw Error('must not read config'); },
    send: async () => { throw Error('must not send'); }, log: silent,
    guard: { check: () => { throw Error('must not check guard'); } },
  }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test('provider failure returns a generic non-success response', async () => {
  const response = await handleContactRequest(request(payload()), dependencies({
    send: async () => ({ error: { message: 'provider detail' } }),
  }));
  assert.equal(response.status, 502);
  assert.doesNotMatch(JSON.stringify(await response.json()), /provider detail/);
});

test('missing key and missing production sender fail without sending', async () => {
  let calls = 0;
  const send = async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; };
  const missingKey = await handleContactRequest(request(payload()), dependencies({
    readConfig: () => ({ ...config(), key: '' }), send,
  }));
  const demoSender = await handleContactRequest(request(payload()), dependencies({
    readConfig: () => ({ ...config(), from: 'Nexus Vantage <onboarding@resend.dev>' }), send,
  }));
  assert.equal(missingKey.status, 503);
  assert.equal(demoSender.status, 503);
  assert.equal(calls, 0);
});

test('a verified sender on the root domain is accepted in production', async () => {
  const sent = [];
  const send = async (_key, mail) => { sent.push(mail); return { data: { id: 'mock-accepted' }, error: null }; };
  const response = await handleContactRequest(request(payload()), dependencies({
    readConfig: () => ({ ...config(), from: 'Nexus Vantage Group <tickets@nexusvantagegroup.com>' }), send,
  }));
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].from, 'Nexus Vantage Group <tickets@nexusvantagegroup.com>');
});

test('an email field holding more than one address is rejected', async () => {
  let calls = 0;
  const deps = dependencies({ send: async () => { calls++; return { data: { id: 'mock-accepted' }, error: null }; } });
  for (const email of ['a@example.com,b@example.com', 'a@example.com;b@example.com', 'a@example.com b@example.com']) {
    const response = await handleContactRequest(request(payload({ email })), deps);
    assert.equal(response.status, 400);
  }
  assert.equal(calls, 0);
});

test('message word limit rejects 301 and accepts 300', async () => {
  let calls = 0;
  const deps = dependencies({ send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; } });
  const tooLong = await handleContactRequest(request(payload({ message: 'word '.repeat(301) })), deps);
  assert.equal(tooLong.status, 400);
  assert.ok((await tooLong.json()).fields.message);
  assert.equal(calls, 0);
  const allowed = await handleContactRequest(request(payload({ message: 'word '.repeat(300) })), deps);
  assert.equal(allowed.status, 200);
  assert.equal(calls, 1);
});

test('missing token returns a token error without sending', async () => {
  let calls = 0;
  const response = await handleContactRequest(request(payload({ _t: undefined })), dependencies({
    send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; },
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, 'token');
  assert.equal(calls, 0);
});

test('young token returns a token error without sending', async () => {
  let calls = 0;
  const response = await handleContactRequest(request(payload({ _t: issueToken('test-secret', NOW - 1_000) })), dependencies({
    send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; },
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, 'token');
  assert.equal(calls, 0);
});

test('token signed with another secret returns a token error', async () => {
  let calls = 0;
  const response = await handleContactRequest(request(payload({ _t: issueToken('wrong-secret', NOW - 5_000) })), dependencies({
    send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; },
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, 'token');
  assert.equal(calls, 0);
});

test('valid aged token permits sending', async () => {
  let calls = 0;
  const response = await handleContactRequest(request(payload()), dependencies({
    send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; },
  }));
  assert.equal(response.status, 200);
  assert.equal(calls, 1);
});

test('duplicate email and message respond successfully without another send', async () => {
  let calls = 0;
  const deps = dependencies({ send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; } });
  assert.equal((await handleContactRequest(request(payload()), deps)).status, 200);
  const repeated = await handleContactRequest(request(payload(), { 'X-Forwarded-For': '198.51.100.10' }), deps);
  assert.equal(repeated.status, 200);
  assert.deepEqual(await repeated.json(), { ok: true });
  assert.equal(calls, 1);
});

test('per-IP sliding limit blocks the fourth distinct ticket but permits another IP', async () => {
  let calls = 0;
  const deps = dependencies({ send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; } });
  for (let i = 0; i < 3; i++) {
    const response = await handleContactRequest(request(payload({ message: `Ticket ${i}` }), { 'X-Forwarded-For': '203.0.113.9' }), deps);
    assert.equal(response.status, 200);
  }
  const blocked = await handleContactRequest(request(payload({ message: 'Ticket 3' }), { 'X-Forwarded-For': '203.0.113.9' }), deps);
  assert.equal(blocked.status, 429);
  assert.equal(calls, 3);
  const other = await handleContactRequest(request(payload({ message: 'Ticket 4' }), { 'X-Forwarded-For': '203.0.113.10' }), deps);
  assert.equal(other.status, 200);
  assert.equal(calls, 4);
});

test('last forwarded address is used for the per-IP limit', async () => {
  const headers = { 'X-Forwarded-For': '198.51.100.7, 203.0.113.9' };
  assert.equal(clientIpFrom(new Headers(headers)), '203.0.113.9');
  const deps = dependencies({ send: async () => ({ data: { id: 'accepted' }, error: null }) });
  for (let i = 0; i < 3; i++) {
    assert.equal((await handleContactRequest(request(payload({ message: `Forwarded ${i}` }), headers), deps)).status, 200);
  }
  assert.equal((await handleContactRequest(request(payload({ message: 'Forwarded 3' }), { 'X-Forwarded-For': '203.0.113.9' }), deps)).status, 429);
});

test('global limit blocks the third distinct ticket with no IP', async () => {
  let calls = 0;
  const guard = createGuard({ ...GUARD_LIMITS, global: [{ count: 2, windowMs: 60_000 }] });
  const deps = dependencies({ guard, send: async () => { calls++; return { data: { id: 'accepted' }, error: null }; } });
  for (let i = 0; i < 2; i++) {
    assert.equal((await handleContactRequest(request(payload({ message: `Global ${i}` })), deps)).status, 200);
  }
  assert.equal((await handleContactRequest(request(payload({ message: 'Global 2' })), deps)).status, 429);
  assert.equal(calls, 2);
});

test('GET issues a token with enforced minimum age', async () => {
  const response = handleTokenRequest({ tokenSecret: 'test-secret', now: () => NOW });
  assert.equal(response.status, 200);
  const { token } = await response.json();
  assert.equal(verifyToken('test-secret', token, NOW + 5_000), 'ok');
  assert.equal(verifyToken('test-secret', token, NOW + 1_000), 'young');
});
