create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null check (char_length(subject) between 3 and 120),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_events (
  id bigint generated always as identity primary key,
  student_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_tickets_student_idx on public.support_tickets(student_id, created_at desc);
create index if not exists app_events_type_idx on public.app_events(event_type, created_at desc);
alter table public.support_tickets enable row level security;
alter table public.app_events enable row level security;
revoke all on public.support_tickets, public.app_events from anon, authenticated;
