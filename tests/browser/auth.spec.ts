import { test, expect } from '@playwright/test';
const user = { id: '11111111-1111-4111-8111-111111111111', email: 'student@example.test' };

test.beforeEach(async ({ page }) => {
  await page.route('https://auth.test/**', route => {
    const url = route.request().url();
    const body = url.includes('/signup') ? { user } : url.includes('/profiles?') ? [{ role: 'student' }] : url.includes('/user') ? user : url.includes('/rest/v1/') ? [] : {};
    return route.fulfill({ json: body });
  });
});

test('signup requires eight characters and directs users to confirm email', async ({ page }) => {
  await page.goto('/?login=student');
  await page.getByRole('button', { name: 'Create an account', exact: true }).click();
  await page.getByLabel('Full Name', { exact: true }).fill('Test Student');
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByLabel('Phone', { exact: true }).fill('9999999999');
  await page.getByLabel('Password', { exact: true }).fill('short');
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  expect(await page.getByLabel('Password', { exact: true }).evaluate((input: HTMLInputElement) => input.validity.tooShort)).toBe(true);
  await page.getByLabel('Password', { exact: true }).fill('new-password');
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByText('Account created. Confirm your email, then sign in.')).toBeVisible();
});

test('invitation validates matching passwords, saves, and returns to student login', async ({ page }) => {
  await page.goto('/?auth-callback=invite#access_token=test-token&type=invite');
  await expect(page.getByRole('heading', { name: 'Welcome to SkillVane', exact: true })).toBeVisible();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await page.getByLabel('New password', { exact: true }).fill('new-password');
  await page.getByLabel('Confirm new password', { exact: true }).fill('different-password');
  await page.getByRole('button', { name: 'Save password' }).click();
  await expect(page.getByRole('alert')).toHaveText('The passwords do not match.');
  await page.getByLabel('Confirm new password', { exact: true }).fill('new-password');
  await page.getByRole('button', { name: 'Save password' }).click();
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();
  await page.getByRole('link', { name: 'Go to student login' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
});

test('admin recovery returns to the admin login', async ({ page }) => {
  await page.route('https://auth.test/rest/v1/profiles?**', route => route.fulfill({ json: [{ role: 'admin' }] }));
  await page.goto('/?password-recovery=1&login=admin#access_token=test-token&type=recovery');
  await page.getByLabel('New password', { exact: true }).fill('new-password');
  await page.getByLabel('Confirm new password', { exact: true }).fill('new-password');
  await page.getByRole('button', { name: 'Save password' }).click();
  await expect(page.getByRole('heading', { name: 'Password updated' })).toBeVisible();
  await page.getByRole('link', { name: 'Go to admin login' }).click();
  await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible();
});

test('expired link offers recovery without displaying a password form', async ({ page }) => {
  await page.goto('/?password-recovery=1#error=access_denied&error_code=otp_expired');
  await expect(page.getByRole('heading', { name: 'Email link expired or invalid' })).toBeVisible();
  await expect(page.getByLabel('New password', { exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Go to student login' }).click();
  await page.getByRole('button', { name: 'Forgot password?' }).click();
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByRole('button', { name: 'Send Reset Link' }).click();
  await expect(page.getByText(/If an account exists for this email/)).toBeVisible();
});

test('email confirmation offers login and strips credentials from the address bar', async ({ page }) => {
  await page.goto('/?auth-callback=signup#access_token=test-token&type=signup');
  await expect(page.getByRole('heading', { name: 'Email confirmed' })).toBeVisible();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
});

test('startup removes old credentials without deleting unrelated storage', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('skillvane_students', JSON.stringify({ password: 'legacy-password' }));
    localStorage.setItem('skillvane_current_student', '{}');
    localStorage.setItem('unrelated', 'preserved');
  });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('skillvane_students'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('skillvane_current_student'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('unrelated'))).toBe('preserved');
});

test('admin can send invitations, student resets, and an account-security email', async ({ page }) => {
  const sent: any[] = [];
  await page.addInitScript(() => localStorage.setItem('skillvane_supabase_session', JSON.stringify({ access_token: 'admin-token', refresh_token: 'test-refresh', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: 'admin-id', email: 'admin@example.test' } })));
  await page.route('https://auth.test/rest/v1/profiles?**', route => route.fulfill({ json: [{ id: 'admin-id', email: 'admin@example.test', full_name: 'Admin', role: 'admin' }] }));
  await page.route('**/api/admin', route => {
    if (route.request().method() === 'POST') { sent.push(route.request().postDataJSON()); return route.fulfill({ json: { sent: true } }); }
    return route.fulfill({ json: { profiles: [{ ...user, full_name: 'Test Student', phone: '', created_at: '2026-01-01' }], enrollments: [], progress: [], payments: [], driveAccess: [], courses: [], modules: [], lessons: [], resources: [], supportTickets: [], events: [], announcements: [], certificates: [] } });
  });
  await page.goto('/?login=admin');
  await expect(page.getByRole('heading', { name: 'Account security' })).toBeVisible();
  await page.getByRole('button', { name: 'Change password', exact: true }).click();
  await expect(page.getByText(/Check your email for a secure link/)).toBeVisible();
  await page.getByRole('button', { name: 'Students', exact: true }).click();
  await page.getByLabel('Student email', { exact: true }).fill('invite@example.test');
  await page.getByLabel('Student name', { exact: true }).fill('Invited Student');
  await page.getByRole('button', { name: 'Send invitation', exact: true }).click();
  await expect(page.getByText(/Invitation sent/)).toBeVisible();
  expect(sent[0]).toEqual({ entity: 'student_invite', values: { email: 'invite@example.test', full_name: 'Invited Student' } });
  await page.getByRole('button', { name: 'Send reset email', exact: true }).click();
  await expect(page.getByText('Password reset email sent to the student.')).toBeVisible();
  expect(sent[1]).toEqual({ entity: 'student_password_reset', values: { student_id: user.id } });
});

test('student signs in, requests password change, and logs out', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('skillvane_onboarding_seen_student@example.test', '1'));
  await page.route('https://auth.test/auth/v1/token?**', route => route.fulfill({ json: { access_token: 'student-token', refresh_token: 'test-refresh', expires_in: 3600, user } }));
  await page.route('https://auth.test/rest/v1/profiles?**', route => route.fulfill({ json: [{ ...user, full_name: 'Test Student', phone: '9999999999', role: 'student' }] }));
  await page.route('**/api/student', route => route.fulfill({ json: { payments: [], tickets: [], announcements: [], certificates: [], recovered: false } }));
  await page.goto('/?login=student');
  await page.getByLabel('Email', { exact: true }).fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill('sixsix');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.getByRole('button', { name: 'Billing & Help', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Account security', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Change password', exact: true }).click();
  await expect(page.getByText(/Check your email for a secure link/)).toBeVisible();
  await page.locator('header').getByRole('button', { name: 'Logout', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('skillvane_supabase_session'))).toBeNull();
  await expect(page.getByRole('button', { name: 'Login', exact: true }).first()).toBeVisible();
});
