create table if not exists public.drive_access_grants (
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  status text not null default 'pending' check (status in ('pending', 'granted', 'failed')),
  last_error text,
  attempted_at timestamptz,
  granted_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, course_id)
);

insert into public.drive_access_grants (student_id, course_id, status)
select student_id, course_id, 'pending'
from public.enrollments
on conflict (student_id, course_id) do nothing;

alter table public.drive_access_grants enable row level security;
revoke all on public.drive_access_grants from anon, authenticated;

create index if not exists drive_access_grants_status_idx
  on public.drive_access_grants(status);
