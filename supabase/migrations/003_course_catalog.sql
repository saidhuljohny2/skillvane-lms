-- Course publishing foundation for the SkillVane lesson player.
create table if not exists public.courses (
  id text primary key,
  title text not null,
  subtitle text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position >= 0),
  unique (course_id, position)
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  video_url text,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  position integer not null check (position >= 0),
  is_preview boolean not null default false,
  is_published boolean not null default false,
  unique (module_id, position)
);

create table if not exists public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  title text not null,
  resource_url text not null,
  resource_type text not null default 'link',
  position integer not null default 0 check (position >= 0)
);

alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_resources enable row level security;

drop policy if exists "Published courses are visible" on public.courses;
create policy "Published courses are visible"
  on public.courses for select using (status = 'published');
drop policy if exists "Published course modules are visible" on public.course_modules;
create policy "Published course modules are visible"
  on public.course_modules for select using (
    exists (select 1 from public.courses where courses.id = course_modules.course_id and courses.status = 'published')
  );
drop policy if exists "Enrolled students can view lessons" on public.course_lessons;
create policy "Enrolled students can view lessons"
  on public.course_lessons for select using (
    is_published and (
      is_preview or exists (
        select 1 from public.course_modules
        join public.enrollments on enrollments.course_id = course_modules.course_id
        where course_modules.id = course_lessons.module_id
          and enrollments.student_id = auth.uid()
      )
    )
  );
drop policy if exists "Enrolled students can view resources" on public.lesson_resources;
create policy "Enrolled students can view resources"
  on public.lesson_resources for select using (
    exists (
      select 1 from public.course_lessons
      join public.course_modules on course_modules.id = course_lessons.module_id
      join public.enrollments on enrollments.course_id = course_modules.course_id
      where course_lessons.id = lesson_resources.lesson_id
        and course_lessons.is_published
        and enrollments.student_id = auth.uid()
    )
  );

insert into public.courses (id, title, subtitle, status) values
  ('multi-cloud-live', 'New Batch: Multi-Cloud Data Engineer Program', 'GCP + Azure live program', 'published'),
  ('gcp-live', 'New Batch: GCP Data Engineering', 'Full live course', 'published'),
  ('gcp-recordings', 'GCP Data Engineering', 'Self-paced recordings', 'published'),
  ('multi-cloud-recordings', 'Multi-Cloud Data Engineer Program', 'GCP + Azure recordings', 'published'),
  ('python-de', 'Python for Data Engineering', 'Hands-on foundation course', 'published'),
  ('project-healthcare', 'Health Care GCP', 'Data engineering project', 'published'),
  ('project-retail', 'Retailer GCP', 'Data engineering project', 'published'),
  ('project-banking', 'Banking GCP', 'Data engineering project', 'published')
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  status = excluded.status,
  updated_at = now();

revoke insert, update, delete on public.courses from anon, authenticated;
revoke insert, update, delete on public.course_modules from anon, authenticated;
revoke insert, update, delete on public.course_lessons from anon, authenticated;
revoke insert, update, delete on public.lesson_resources from anon, authenticated;
