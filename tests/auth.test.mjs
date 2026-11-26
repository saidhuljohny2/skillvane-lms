import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import adminHandler from '../api/admin.js';

const compiled = await build({ entryPoints: ['src/app/lib/supabase.ts'], bundle: true, write: false, format: 'esm', define: { 'import.meta.env.VITE_SUPABASE_URL': '"https://auth.test"', 'import.meta.env.VITE_SUPABASE_ANON_KEY': '"public-test-key"' } });
const auth = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const sessionKey = 'skillvane_supabase_session';
const user = { id: '11111111-1111-4111-8111-111111111111', email: 'student@example.test' };
const session = { access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user };
let storage;
let calls;
function setup(url = 'https://site.test/') {
  storage = new Map(); calls = [];
  globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) };
  globalThis.document = { title: 'Test' };
  globalThis.window = { location: new URL(url), history: { replaceState(_a, _b, path) { window.location = new URL(path, window.location); } } };
}
function respond(handler) {
  globalThis.fetch = async (url, init = {}) => {
    const call = { url: String(url), ...init, body: init.body ? JSON.parse(init.body) : undefined };
    calls.push(call);
    const result = handler(call);
    return new Response(JSON.stringify(result.body ?? result), { status: result.status ?? 200, headers: { 'Content-Type': 'application/json' } });
  };
}
test.beforeEach(() => setup());

test('signup enforces eight characters before any request', async () => {
  respond(() => ({}));
  await assert.rejects(auth.signUpStudent(user.email, 'short', 'Student', '9999999999'), /8 characters/);
  assert.equal(calls.length, 0);
});
test('signup with confirmation does not store a session or password', async () => {
  respond(() => ({ user }));
  const result = await auth.signUpStudent(user.email, 'sample-password', 'Student', '9999999999');
  assert.equal(result.session, null);
  assert.equal(storage.size, 0);
  assert.match(decodeURIComponent(calls[0].url), /auth-callback=signup/);
});
test('signup accepts the top-level GoTrue session when confirmation is disabled', async () => {
  respond(() => session);
  const result = await auth.signUpStudent(user.email, 'sample-password', 'Student', '9999999999');
  assert.equal(result.session.access_token, session.access_token);
  assert.ok(!storage.get(sessionKey).includes('sample-password'));
});
test('existing short passwords still reach Auth at login', async () => {
  respond(call => call.url.includes('/token?') ? session : call.url.includes('/profiles?') ? [{ email: user.email, full_name: 'Student', phone: '', role: 'student' }] : []);
  await auth.signInStudent(user.email, 'sixsix');
  assert.equal(calls[0].body.password, 'sixsix');
  assert.ok(storage.has(sessionKey));
});
test('confirmation resend and admin reset use explicit safe destinations', async () => {
  respond(() => ({}));
  await auth.resendConfirmation(user.email);
  await auth.sendPasswordReset(user.email, 'admin');
  assert.equal(calls[0].body.type, 'signup');
  assert.match(decodeURIComponent(calls[1].url), /login=admin/);
});
test('invite tokens are captured and removed from browser URL', () => {
  setup('https://site.test/?auth-callback=invite#access_token=secret&refresh_token=secret-refresh&type=invite');
  const callback = auth.readAuthCallback();
  assert.equal(callback.kind, 'invite');
  assert.equal(callback.accessToken, 'secret');
  auth.clearAuthCallbackUrl();
  assert.equal(window.location.href, 'https://site.test/');
  assert.equal(storage.size, 0);
});
test('expired and missing-token links show an error rather than normal login', () => {
  setup('https://site.test/?password-recovery=1#Error=ignored&error_code=otp_expired');
  assert.match(auth.readAuthCallback().error, /expired/);
  setup('https://site.test/?auth-callback=invite');
  assert.match(auth.readAuthCallback().error, /expired/);
});
test('email confirmation callback is distinguished from password setup', () => {
  setup('https://site.test/?auth-callback=signup#access_token=test&type=signup');
  assert.equal(auth.readAuthCallback().kind, 'signup');
  assert.equal(auth.readAuthCallback().error, '');
});
test('password recovery uses link token, returns actual role, and clears session', async () => {
  storage.set(sessionKey, JSON.stringify(session));
  respond(call => call.method === 'PUT' ? user : call.url.includes('/profiles?') ? [{ role: 'admin' }] : {});
  assert.equal(await auth.completePasswordRecovery('new-password', 'link-token'), 'admin');
  assert.equal(calls[0].headers.Authorization, 'Bearer link-token');
  assert.deepEqual(calls[0].body, { password: 'new-password' });
  assert.equal(storage.has(sessionKey), false);
  assert.match(calls.at(-1).url, /logout/);
});
test('expired recovery token cannot update a password', async () => {
  respond(() => ({ status: 401, body: { message: 'This link has expired.' } }));
  await assert.rejects(auth.completePasswordRecovery('new-password', 'expired'), /expired/);
  assert.equal(calls.length, 1);
});
test('session expiry refreshes successfully', async () => {
  storage.set(sessionKey, JSON.stringify({ ...session, expires_at: 1 }));
  respond(() => session);
  assert.equal(await auth.getValidAccessToken(), session.access_token);
  assert.match(calls[0].url, /grant_type=refresh_token/);
});
test('rejected refresh clears stale login and asks user to sign in', async () => {
  storage.set(sessionKey, JSON.stringify({ ...session, expires_at: 1 }));
  respond(() => ({ status: 401, body: { message: 'Invalid refresh token' } }));
  await assert.rejects(auth.getValidAccessToken(), /session expired/);
  assert.equal(storage.has(sessionKey), false);
});
test('logout clears local session even if remote logout fails', async () => {
  storage.set(sessionKey, JSON.stringify(session));
  globalThis.fetch = async () => { throw new TypeError('Offline'); };
  await auth.signOutStudent();
  assert.equal(storage.has(sessionKey), false);
});

async function adminCall(body, role = 'admin', authorized = true) {
  process.env.VITE_SUPABASE_URL = 'https://auth.test';
  process.env.VITE_SUPABASE_ANON_KEY = 'public-test-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'private-test-key';
  process.env.SITE_URL = 'https://site.test';
  respond(call => call.url.endsWith('/auth/v1/user') ? { id: 'admin-id' } : call.url.includes('id=eq.admin-id') ? [{ role }] : call.url.includes('/profiles?') ? [{ email: user.email, role: 'student' }] : {});
  const response = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(payload) { this.payload = payload; return this; }, setHeader() {} };
  await adminHandler({ method: 'POST', headers: authorized ? { authorization: 'Bearer admin-token' } : {}, body }, response);
  return response;
}
test('unauthenticated and non-admin accounts cannot send invitations', async () => {
  const body = { entity: 'student_invite', values: { email: user.email } };
  assert.equal((await adminCall(body, 'student', false)).statusCode, 401);
  assert.equal((await adminCall(body, 'student')).statusCode, 403);
  assert.ok(calls.every(call => !call.url.includes('/invite')));
});
test('admin invitation uses server key, trusted origin and only allowed metadata', async () => {
  const result = await adminCall({ entity: 'student_invite', values: { email: ' Student@Example.test ', full_name: 'Student', role: 'admin', redirect_to: 'https://evil.test' } });
  assert.equal(result.statusCode, 200);
  const call = calls.at(-1);
  assert.match(decodeURIComponent(call.url), /redirect_to=https:\/\/site.test\/\?auth-callback=invite/);
  assert.equal(call.headers.Authorization, 'Bearer private-test-key');
  assert.deepEqual(call.body, { email: user.email, data: { full_name: 'Student' } });
});
test('admin rejects malformed invitation without sending email', async () => {
  assert.equal((await adminCall({ entity: 'student_invite', values: { email: 'bad' } })).statusCode, 400);
  assert.ok(calls.every(call => !call.url.includes('/invite')));
});
test('student reset resolves address on server instead of trusting submitted email', async () => {
  assert.equal((await adminCall({ entity: 'student_password_reset', values: { student_id: user.id, email: 'other@example.test' } })).statusCode, 200);
  assert.equal(calls.at(-1).body.email, user.email);
  assert.match(calls.at(-1).url, /\/recover\?/);
});
