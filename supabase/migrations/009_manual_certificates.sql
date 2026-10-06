-- Admin-issued certificates may be for recipients who do not have an LMS account.
alter table public.certificates alter column student_id drop not null;

