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

## Integration reliability rollout (migration 010)

1. Apply all numbered SQL migrations in order, including
   `supabase/migrations/010_integration_reliability.sql`, before deploying this
   version. This migration creates server-only payment/certificate RPCs and the
   persistent delivery queue. It does not email past customers or change their
   existing Drive permissions. Do not rerun old course seed migrations after
   editing catalog settings.
2. In Admin > Courses, configure recordings, notes, and live-session links.
   Migration 010 pauses enrollment for the three courses with missing resources:
   multi-cloud-live, gcp-live, and multi-cloud-recordings. Supply actual links and
   enable enrollment when ready. Certificate module counts must match the
   curriculum progress indexes (currently 19/13/4/5/3 depending on course).
   Catalog title, subtitle, publishing status, sale availability, and resource
   links now come from Supabase. Prices remain in shared/pricing-config.js.
3. Deploy `scripts/google-drive-enrollment.gs` as the resource owner. Put the
   same secret in Script Properties `DRIVE_WEBHOOK_SECRET` and Vercel
   `GOOGLE_DRIVE_ACCESS_SECRET`. Set `GOOGLE_DRIVE_ACCESS_WEBHOOK_URL`. The updated
   signed protocol grants every configured notes/recordings resource, including
   individual Google Sheets files. Update the Apps Script deployment version.
4. Deploy `scripts/google-sheet-enrollment.gs` as the sheet owner. Set Script
   Properties `SPREADSHEET_ID`, `SHEET_NAME` (optional), and `SHEET_WEBHOOK_SECRET`.
   Set Vercel `GOOGLE_SHEET_WEBHOOK_URL` and `GOOGLE_SHEET_WEBHOOK_SECRET` to match.
   Use a new worksheet for its defined columns. Disable the old unsigned endpoint.
5. Set all four EMAILJS_* server variables from .env.example and enable EmailJS
   requests from non-browser applications. Verify the existing invoice template
   uses to_email, to_name, invoice_no, payment_id, course_name, amount, paid_at,
   original_amount, discount_amount, multi_course_discount, and coupon_code.
   Missing configuration produces a visible failed delivery, never false success.
6. In Razorpay, enable automatic capture and subscribe a webhook to
   `https://YOUR_DOMAIN/api/payment-webhook` for `payment.captured` and `order.paid`.
   Set its secret as `RAZORPAY_WEBHOOK_SECRET` in Vercel. The webhook validates raw
   bytes and independently fetches payment status, amount, currency, and order.
7. Set `CRON_SECRET`. The included Vercel schedule runs daily at 03:00 UTC
   (08:30 IST), compatible with a daily cron allowance. Successful checkouts and
   webhooks also attempt delivery immediately using Vercel waitUntil, so the
   response does not wait for external delivery providers. Each worker run processes up to
   three due jobs; use a more frequent authenticated scheduler for higher
   throughput or faster recovery if the hosting plan permits. Admin Overview
   lists pending/failed delivery jobs with a manual retry button. Retry backoff
   is exponential; leased work is eligible again after five minutes if interrupted.
8. Run `pnpm install --frozen-lockfile`, `pnpm run test:auth`,
   `pnpm run test:integrations`, `pnpm run test:auth:browser`, and `pnpm run build`.
   Run Razorpay test-mode checkout/capture and webhook redelivery with a controlled
   inbox and Drive account before switching traffic to the new deployment.

Payment status, enrollment, and the delivery jobs commit in one transaction.
Duplicate callbacks do not create new jobs or change the original payment date.
Google Sheets deduplicates by job ID. EmailJS has no transaction shared with our
queue: if an email is accepted and the subsequent database update fails, retry
can send a duplicate. Invoice numbers are stable so those messages remain
identifiable as the same receipt. Invoice amounts come from the saved order.

Student certificates require enrollment and all saved curriculum progress entries.
Names come from the student's profile; course names and completion dates come
from the server. Progress is self-reported learning progress, not proctored
assessment. Admins retain explicitly authorized manual certificate issuance.
Supabase SMTP, redirect allowlists, and the eight-character service policy still
must be verified in the Supabase project; repository changes cannot set them.
