create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  message text not null check (char_length(message) between 3 and 1000),
  course_id text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id text primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  student_name text not null,
  course_id text not null,
  course_name text not null,
  completion_date date not null,
  issued_at timestamptz not null default now(),
  unique(student_id, course_id)
);

create index if not exists announcements_created_idx on public.announcements(created_at desc);
create index if not exists certificates_student_idx on public.certificates(student_id, issued_at desc);
alter table public.announcements enable row level security;
alter table public.certificates enable row level security;
revoke all on public.announcements, public.certificates from anon, authenticated;
