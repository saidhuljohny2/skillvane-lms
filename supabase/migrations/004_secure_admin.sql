-- Grant the SkillVane owner account server-verified administrator access.
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = 'saidhuljohny@gmail.com';

create index if not exists profiles_role_idx on public.profiles(role);
