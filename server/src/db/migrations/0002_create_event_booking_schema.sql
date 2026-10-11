-- Apply after 0000_create_users.sql and 0001_add_email_verified_at.sql.
-- Safe to re-run: existing tables, types, columns, and indexes are preserved.

begin;

do $$
begin
  create type public.event_status as enum (
    'draft',
    'published',
    'cancelled',
    'completed'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.booking_status as enum (
    'pending',
    'reserved',
    'paid',
    'failed',
    'expired',
    'refunded'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_method as enum (
    'telebirr',
    'cbebirr',
    'chapa',
    'pay_at_gate'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.payment_status as enum (
    'pending',
    'completed',
    'failed',
    'refunded'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.ticket_status as enum (
    'issued',
    'scanned',
    'cancelled'
  );
exception
  when duplicate_object then null;
end
$$;

alter table public.users
  add column if not exists email_verified_at timestamptz;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.users(id) on delete restrict,
  title varchar(255) not null,
  title_am varchar(255),
  description text,
  description_am text,
  category varchar(100) not null,
  venue varchar(255),
  venue_address text,
  city varchar(100) not null default 'Addis Ababa',
  start_at timestamptz not null,
  end_at timestamptz,
  image_url text,
  total_capacity integer not null default 0,
  available_capacity integer not null default 0,
  is_free boolean not null default false,
  status public.event_status not null default 'draft',
  tags text[],
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_organizer_idx on public.events (organizer_id);
create index if not exists events_status_idx on public.events (status);
create index if not exists events_category_idx on public.events (category);
create index if not exists events_start_at_idx on public.events (start_at);

create table if not exists public.ticket_tiers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name varchar(100) not null,
  name_am varchar(100),
  price numeric(12, 2) not null default 0,
  currency varchar(3) not null default 'ETB',
  total_quantity integer not null,
  available_quantity integer not null,
  max_per_booking integer not null default 10,
  sale_start_at timestamptz,
  sale_end_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists ticket_tiers_event_idx
  on public.ticket_tiers (event_id);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  guest_phone varchar(20),
  guest_name varchar(255),
  event_id uuid not null references public.events(id) on delete restrict,
  tier_id uuid not null references public.ticket_tiers(id) on delete restrict,
  quantity integer not null,
  unit_price numeric(12, 2) not null,
  total_amount numeric(12, 2) not null,
  currency varchar(3) not null default 'ETB',
  payment_method public.payment_method,
  status public.booking_status not null default 'pending',
  idempotency_key varchar(255) unique,
  reserved_until timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_idx on public.bookings (user_id);
create index if not exists bookings_event_idx on public.bookings (event_id);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_idempotency_idx
  on public.bookings (idempotency_key);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  qr_uuid uuid not null default gen_random_uuid() unique,
  seat_label varchar(50),
  status public.ticket_status not null default 'issued',
  issued_at timestamptz not null default now(),
  scanned_at timestamptz,
  scanned_by uuid references public.users(id) on delete set null,
  gate_notes text
);

create index if not exists tickets_booking_idx on public.tickets (booking_id);
create index if not exists tickets_qr_uuid_idx on public.tickets (qr_uuid);
create index if not exists tickets_status_idx on public.tickets (status);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  gateway public.payment_method not null,
  gateway_request_id varchar(255),
  transaction_id varchar(255),
  amount numeric(12, 2) not null,
  currency varchar(3) not null default 'ETB',
  status public.payment_status not null default 'pending',
  webhook_payload jsonb,
  idempotency_key varchar(255) unique,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_booking_idx on public.payments (booking_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payments_transaction_idx
  on public.payments (transaction_id);

create table if not exists public.accounts (
  user_id uuid not null references public.users(id) on delete cascade,
  type varchar(50) not null,
  provider varchar(100) not null,
  provider_account_id varchar(255) not null,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type varchar(50),
  scope text,
  id_token text,
  session_state text,
  primary key (provider, provider_account_id)
);

create index if not exists accounts_user_id_idx on public.accounts (user_id);

create table if not exists public.sessions (
  session_token varchar(255) primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  expires timestamptz not null
);

create index if not exists sessions_user_id_idx on public.sessions (user_id);

create table if not exists public.verification_tokens (
  identifier varchar(255) not null,
  token varchar(255) not null,
  expires timestamptz not null,
  primary key (identifier, token)
);

create table if not exists public.authenticators (
  credential_id text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  provider_account_id varchar(255) not null,
  credential_public_key text not null,
  counter integer not null,
  credential_device_type varchar(32) not null,
  credential_backed_up boolean not null,
  transports varchar(255),
  primary key (user_id, credential_id)
);

alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.ticket_tiers enable row level security;
alter table public.bookings enable row level security;
alter table public.tickets enable row level security;
alter table public.payments enable row level security;
alter table public.accounts enable row level security;
alter table public.sessions enable row level security;
alter table public.verification_tokens enable row level security;
alter table public.authenticators enable row level security;

commit;
