alter table public.payment_orders
  add column if not exists student_id uuid references public.profiles(id) on delete cascade;

create index if not exists payment_orders_student_id_idx
  on public.payment_orders(student_id);

create or replace function public.complete_payment_enrollment(
  p_order_id text,
  p_payment_id text,
  p_student_id uuid
)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.payment_orders%rowtype;
  v_course_id text;
  v_course_amount integer;
begin
  select * into v_order
  from public.payment_orders
  where order_id = p_order_id and student_id = p_student_id
  for update;

  if not found then
    raise exception 'Payment order was not found for this student';
  end if;

  if v_order.status = 'paid' and v_order.payment_id <> p_payment_id then
    raise exception 'Payment order was already completed';
  end if;

  v_course_amount := round(v_order.amount_paise::numeric / greatest(cardinality(v_order.course_ids), 1));
  foreach v_course_id in array v_order.course_ids loop
    insert into public.enrollments (student_id, course_id, payment_id, amount_paid_paise)
    values (p_student_id, v_course_id, p_payment_id, v_course_amount)
    on conflict (student_id, course_id) do update
      set payment_id = excluded.payment_id,
          amount_paid_paise = excluded.amount_paid_paise;
  end loop;

  update public.payment_orders
  set status = 'paid', payment_id = p_payment_id, verified_at = now()
  where order_id = p_order_id;

  return v_order.course_ids;
end;
$$;

revoke all on function public.complete_payment_enrollment(text, text, uuid) from public, anon, authenticated;
grant execute on function public.complete_payment_enrollment(text, text, uuid) to service_role;
