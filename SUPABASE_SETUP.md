# Supabase setup for SkillVane LMS

This migration replaces browser-only accounts and enrollments with Supabase Auth
and PostgreSQL. Passwords will be handled by Supabase Auth and will never be
stored in the website's local storage or application tables.

## Required project configuration

1. Create or connect a Supabase project.
2. Run `supabase/migrations/001_skillvane_lms.sql` in the SQL editor.
3. In Supabase Auth, enable Email + Password and configure the production site
   URL as `https://skillvane.vercel.app`.
4. Add these Vercel environment variables for Production:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

The URL and anon key are designed for browser use and are protected by Row
Level Security. The service-role key must remain server-side. It must never use
the `VITE_` prefix or appear in frontend source.

## Authentication cleanup

Signup, login, password reset, and session restoration use Supabase Auth.
Browser-only signup and EmailJS password OTP handling have been removed.
On startup, the app removes the legacy `skillvane_students` credential store
and `skillvane_current_student` session from that browser. Supabase sessions
and unrelated browser data are preserved.

Deploy the updated app to enable cleanup for visitors. Old data on other
browsers or devices is removed when they next open the updated app.
Browser-only accounts are not migrated into Supabase; affected users must
register a Supabase account. If Supabase is not configured, login remains
unavailable instead of trusting a browser-local account.

## Account email configuration

- Set server-side `SITE_URL` to the deployed site origin. The default is
  `https://skillvane.vercel.app`. Invitations and admin reset emails use this
  trusted origin rather than a URL submitted by the browser.
- In Supabase Auth URL Configuration, allow these redirects for each approved
  origin (including localhost when testing):
  - `https://skillvane.vercel.app/?auth-callback=signup`
  - `https://skillvane.vercel.app/?auth-callback=invite`
  - `https://skillvane.vercel.app/?password-recovery=1&login=student`
  - `https://skillvane.vercel.app/?password-recovery=1&login=admin`
- Set Supabase's minimum password length to 8 to enforce the same rule at the
  authentication service. Existing shorter passwords remain usable for login.
- Enable email confirmation and configure production SMTP delivery and Auth
  email rate limits. Use the default confirmation URL in confirmation, invite,
  and recovery templates so Supabase verifies links before returning tokens.
- The app uses implicit Auth email callbacks (tokens in URL fragments), removes
  the fragment on arrival, and keeps recovery tokens only in component memory.
  Reloading the password form requires reopening the email link or requesting
  a fresh link. Password completion returns users to their role's login.
- Students can change passwords from Account security in their dashboard;
  admins have the same control in Overview. Both verify email ownership with
  a reset link. Admin invitations and student reset actions require a verified
  admin session on the server. Course access must still be granted separately.

## Verification

Run `npm run test:auth`, `npm run test:auth:browser`, and `npm run build`.
Browser checks require Playwright Chromium (`npx playwright install chromium`)
or set `PLAYWRIGHT_CHANNEL=msedge` to use installed Microsoft Edge. The automated checks use simulated
Auth responses and never send real email. Before deployment acceptance, use a
controlled student inbox to check signup/confirmation, resend confirmation,
invitation/password setup, student and admin recovery, an expired or reused
link, logout, and session expiry with the configured Supabase project. Verify
SMTP delivery and the redirect allowlist on that project; local tests cannot
confirm those settings.
