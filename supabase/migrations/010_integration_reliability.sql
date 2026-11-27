alter table public.payment_orders add column if not exists invoice_details jsonb not null default '{}'::jsonb;
-- Apply before deploying the integration changes. All RPCs are server-only.
alter table public.courses
  add column if not exists delivery_mode text not null default 'drive' check (delivery_mode in ('drive','live')),
  add column if not exists drive_url text not null default '',
  add column if not exists notes_url text not null default '',
  add column if not exists live_url text not null default '',
  add column if not exists sale_enabled boolean not null default false,
  add column if not exists certificate_module_count integer not null default 0 check (certificate_module_count >= 0);
insert into public.courses (id,title,subtitle,status) values
 ('project-traffic','Traffic GCP','Data engineering project','published') on conflict (id) do nothing;
update public.courses set delivery_mode='live', drive_url='', notes_url='', live_url='https://meet.google.com/tvb-vzfp-qpm', certificate_module_count=19, sale_enabled=false where id='multi-cloud-live';
update public.courses set delivery_mode='live', drive_url='', notes_url='', live_url='https://meet.google.com/tvb-vzfp-qpm', certificate_module_count=13, sale_enabled=false where id='gcp-live';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/1VsxvQYeTeCd1WuDxeDHJ3iQ-HUd9wS-h', notes_url='https://drive.google.com/drive/folders/1VsxvQYeTeCd1WuDxeDHJ3iQ-HUd9wS-h', live_url='', certificate_module_count=13, sale_enabled=true where id='gcp-recordings';
update public.courses set delivery_mode='drive', drive_url='', notes_url='', live_url='', certificate_module_count=19, sale_enabled=false where id='multi-cloud-recordings';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/1Y2XuyAX42D6NEo5bQyD_K2ut2uZmdACk', notes_url='https://drive.google.com/drive/folders/1Y2XuyAX42D6NEo5bQyD_K2ut2uZmdACk', live_url='', certificate_module_count=4, sale_enabled=true where id='python-de';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/1QO-fMXUP3DGkyJ9SWMfEjmvFGJnnEd4E', notes_url='https://drive.google.com/drive/folders/1QO-fMXUP3DGkyJ9SWMfEjmvFGJnnEd4E', live_url='', certificate_module_count=4, sale_enabled=true where id='project-healthcare';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/1pFg_ZlTOX75ijqYxCusHvcVXmjuLGXlR', notes_url='https://drive.google.com/drive/folders/1pFg_ZlTOX75ijqYxCusHvcVXmjuLGXlR', live_url='', certificate_module_count=4, sale_enabled=true where id='project-retail';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/1JFILNA36Um1SgUKc9jzjFUhm8PnVzgJX', notes_url='https://docs.google.com/spreadsheets/d/1yqLvpr-Q2hwvrJRbgWgWjdNwssAI6UBgQDDqa1oqR8k/edit', live_url='', certificate_module_count=5, sale_enabled=true where id='project-banking';
update public.courses set delivery_mode='drive', drive_url='https://drive.google.com/drive/folders/19yHS4lPRjX7B7jQdc0O5YUrD2XxrQBHv', notes_url='https://drive.google.com/drive/folders/19yHS4lPRjX7B7jQdc0O5YUrD2XxrQBHv', live_url='', certificate_module_count=3, sale_enabled=true where id='project-traffic';

create table public.delivery_jobs (
 id uuid primary key default gen_random_uuid(),
 order_id text not null references public.payment_orders(order_id),
 kind text not null check (kind in ('drive','invoice','sheet')),
 status text not null default 'pending' check (status in ('pending','processing','sent','failed')),
 attempts integer not null default 0,
 next_attempt_at timestamptz not null default now(),
 locked_until timestamptz,
 lease_token uuid,
 last_error text,
 completed_at timestamptz,
 created_at timestamptz not null default now(),
 unique(order_id,kind)
);
alter table public.delivery_jobs enable row level security;
revoke all on public.delivery_jobs from anon, authenticated;
grant all on public.delivery_jobs to service_role;
create index delivery_jobs_due_idx on public.delivery_jobs(next_attempt_at) where status <> 'sent';

create or replace function public.complete_payment_enrollment(p_order_id text,p_payment_id text,p_student_id uuid)
returns text[] language plpgsql security definer set search_path=public as $$
declare v_order public.payment_orders%rowtype; v_course text; v_index integer := 0; v_count integer;
begin
 select * into v_order from public.payment_orders where order_id=p_order_id and student_id=p_student_id for update;
 if not found then raise exception 'Payment order was not found for this student'; end if;
 if v_order.status='paid' and v_order.payment_id is distinct from p_payment_id then raise exception 'Payment order was already completed'; end if;
 if v_order.status <> 'paid' then
  v_count := cardinality(v_order.course_ids);
  if coalesce(v_count,0)=0 then raise exception 'No courses in payment order'; end if;
  foreach v_course in array v_order.course_ids loop
   insert into public.enrollments(student_id,course_id,payment_id,amount_paid_paise)
   values(p_student_id,v_course,p_payment_id,(v_order.amount_paise/v_count)+case when v_index < (v_order.amount_paise % v_count) then 1 else 0 end)
   on conflict(student_id,course_id) do update set payment_id=excluded.payment_id,amount_paid_paise=excluded.amount_paid_paise;
   v_index := v_index+1;
  end loop;
  update public.payment_orders set status='paid',payment_id=p_payment_id,verified_at=now() where order_id=p_order_id;
 end if;
 insert into public.delivery_jobs(order_id,kind) values(p_order_id,'drive'),(p_order_id,'invoice'),(p_order_id,'sheet') on conflict do nothing;
 return v_order.course_ids;
end; $$;

create function public.claim_delivery_jobs(p_order_id text default null,p_limit integer default 3)
returns setof public.delivery_jobs language plpgsql security definer set search_path=public as $$
begin
 return query with picked as (
  select id from public.delivery_jobs where (p_order_id is null or order_id=p_order_id)
   and status <> 'sent' and next_attempt_at <= now() and (locked_until is null or locked_until < now())
   order by next_attempt_at,created_at for update skip locked limit least(greatest(p_limit,1),10)
 ) update public.delivery_jobs j set status='processing',attempts=attempts+1,locked_until=now()+interval '5 minutes',lease_token=gen_random_uuid()
 from picked where j.id=picked.id returning j.*;
end; $$;

create function public.issue_student_certificate(p_student_id uuid,p_course_id text)
returns setof public.certificates language plpgsql security definer set search_path=public as $$
declare v_course public.courses%rowtype; v_name text; v_count integer; v_date date;
begin
 perform 1 from public.enrollments where student_id=p_student_id and course_id=p_course_id for update;
 if not found then raise exception 'Enrollment is required for a certificate' using errcode='42501'; end if;
 if exists(select 1 from public.certificates where student_id=p_student_id and course_id=p_course_id) then
  return query select * from public.certificates where student_id=p_student_id and course_id=p_course_id; return;
 end if;
 select * into v_course from public.courses where id=p_course_id;
 if not found or v_course.certificate_module_count < 1 then raise exception 'Certificate requirements have not been configured' using errcode='42501'; end if;
 select count(distinct module_index),(max(completed_at) at time zone 'Asia/Kolkata')::date into v_count,v_date from public.learning_progress
 where student_id=p_student_id and course_id=p_course_id and module_index>=0 and module_index<v_course.certificate_module_count;
 if v_count <> v_course.certificate_module_count then raise exception 'Complete every course module before requesting a certificate' using errcode='42501'; end if;
 select full_name into v_name from public.profiles where id=p_student_id;
 if length(trim(coalesce(v_name,'')))<2 then raise exception 'Update your profile name before requesting a certificate'; end if;
 return query insert into public.certificates(id,student_id,student_name,course_id,course_name,completion_date)
 values('SV-'||upper(replace(gen_random_uuid()::text,'-','')),p_student_id,v_name,p_course_id,v_course.title,v_date) returning *;
end; $$;

revoke all on function public.complete_payment_enrollment(text,text,uuid) from public,anon,authenticated;
revoke all on function public.claim_delivery_jobs(text,integer) from public,anon,authenticated;
revoke all on function public.issue_student_certificate(uuid,text) from public,anon,authenticated;
grant execute on function public.complete_payment_enrollment(text,text,uuid) to service_role;
grant execute on function public.claim_delivery_jobs(text,integer) to service_role;
grant execute on function public.issue_student_certificate(uuid,text) to service_role;

-- Unpublishing stops new sales without removing existing students' resource links.
create policy "Enrolled students can retain course details" on public.courses for select
 using (exists(select 1 from public.enrollments where enrollments.course_id=courses.id and enrollments.student_id=auth.uid()));
