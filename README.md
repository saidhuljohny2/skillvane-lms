# SkillVane LMS

A production-oriented foundation for SkillVane IT Academy, built with open-source
tools: React, TypeScript, Vite, Tailwind CSS, TanStack Query, and Supabase.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The public site works without Supabase credentials. Authentication becomes
available after adding a Supabase project URL and anonymous key.

## Supabase setup

1. Create a Supabase project.
2. Apply `supabase/migrations/202609030001_initial_schema.sql`.
3. Enable email magic-link authentication.
4. Copy the project URL and anonymous key into `.env.local`.
5. Add the deployed site URL to Supabase's authentication redirect allowlist.

Never add a service-role key, payment secret, or admin password to a `VITE_*`
variable. Vite variables are public in the browser bundle.

## Quality checks

```bash
npm run typecheck
npm run build
```

## Architecture

- `src/app/pages` — route-level experiences
- `src/app/data` — typed, temporary catalog content
- `src/app/auth` — Supabase session boundary and sign-in UI
- `src/app/lib` — environment and service clients
- `supabase/migrations` — database schema and row-level security

Payment order creation, webhook verification, enrollment activation, and admin
operations must run in trusted server-side functions. They are intentionally not
implemented in the browser.
