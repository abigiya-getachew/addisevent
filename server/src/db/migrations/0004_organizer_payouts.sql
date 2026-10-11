begin;

create table if not exists public.organizer_payout_accounts (
  user_id uuid primary key references public.users(id) on delete cascade,
  method varchar(20) not null,
  account_holder_name varchar(255) not null,
  account_number varchar(255) not null,
  is_verified boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint organizer_payout_accounts_method_check
    check (method in ('telebirr', 'cbebirr', 'bank_transfer'))
);

create table if not exists public.organizer_payouts (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.users(id) on delete restrict,
  event_id uuid references public.events(id) on delete set null,
  amount numeric(12, 2) not null check (amount >= 0),
  status varchar(20) not null
    check (status in ('processing', 'sent', 'failed')),
  reference_id varchar(255),
  scheduled_at timestamptz,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organizer_payouts_organizer_created_idx
  on public.organizer_payouts (organizer_id, created_at desc);

alter table public.organizer_payout_accounts enable row level security;
alter table public.organizer_payouts enable row level security;

revoke all on table public.organizer_payout_accounts from anon, authenticated;
revoke all on table public.organizer_payouts from anon, authenticated;

commit;
