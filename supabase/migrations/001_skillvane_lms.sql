-- SkillVane LMS foundation: authenticated profiles, enrollments, and progress.
-- Run this migration in a new Supabase project before enabling the new auth flow.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  payment_id text,
  amount_paid_paise integer not null default 0 check (amount_paid_paise >= 0),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.learning_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  module_index integer not null check (module_index >= 0),
  completed_at timestamptz not null default now(),
  primary key (student_id, course_id, module_index)
);

create table if not exists public.payment_orders (
  order_id text primary key,
  student_email text not null,
  course_ids text[] not null,
  amount_paise integer not null check (amount_paise > 0),
  payment_id text unique,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.learning_progress enable row level security;
alter table public.payment_orders enable row level security;

drop policy if exists "Students can read their profile" on public.profiles;
create policy "Students can read their profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Students can read their enrollments" on public.enrollments;
create policy "Students can read their enrollments"
  on public.enrollments for select
  using (auth.uid() = student_id);

drop policy if exists "Students can read their progress" on public.learning_progress;
create policy "Students can read their progress"
  on public.learning_progress for select
  using (auth.uid() = student_id);

drop policy if exists "Students can add their progress" on public.learning_progress;
create policy "Students can add their progress"
  on public.learning_progress for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from public.enrollments
      where enrollments.student_id = auth.uid()
        and enrollments.course_id = learning_progress.course_id
    )
  );

drop policy if exists "Students can remove their progress" on public.learning_progress;
create policy "Students can remove their progress"
  on public.learning_progress for delete
  using (auth.uid() = student_id);

create index if not exists enrollments_student_id_idx
  on public.enrollments(student_id);
create index if not exists learning_progress_student_id_idx
  on public.learning_progress(student_id);
create index if not exists payment_orders_student_email_idx
  on public.payment_orders(student_email);

-- Keep role changes server-only so a student cannot promote their own account.
revoke update on public.profiles from authenticated;
revoke all on public.payment_orders from anon, authenticated;

