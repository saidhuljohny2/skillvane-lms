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

## Migration sequence

After the project is connected, deploy the application integration in this
order:

1. Student signup, login, password reset, and session restoration.
2. Payment-order storage and verified enrollment creation.
3. Server-backed learning progress.
4. Admin role login and student/enrollment management.
5. Remove the legacy browser-local account store and EmailJS OTP flow.

The legacy flow should remain active until the connected backend passes its
production smoke tests, avoiding a login outage for existing students.
