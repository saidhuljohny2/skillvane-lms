create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'instructor', 'admin');
create type public.enrollment_status as enum ('pending', 'active', 'cancelled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  price_inr integer not null check (price_inr >= 0),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  status public.enrollment_status not null default 'pending',
  payment_provider text,
  payment_reference text,
  enrolled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create index enrollments_student_id_idx on public.enrollments(student_id);
create index enrollments_course_id_idx on public.enrollments(course_id);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;

create policy "Profiles are visible to their owners"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id and role = 'student');

create policy "Published courses are publicly visible"
on public.courses for select
to anon, authenticated
using (published = true);

create policy "Students can view their own enrollments"
on public.enrollments for select
to authenticated
using ((select auth.uid()) = student_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enrollment creation and payment verification belong in a server-side Edge
-- Function. Never grant clients permission to mark an enrollment as active.
