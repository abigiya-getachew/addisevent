-- Attendee profile preferences, saved events, and verified event reviews.

begin;

alter table public.users
  add column if not exists interests text[] not null default '{}',
  add column if not exists email_notifications boolean not null default true,
  add column if not exists sms_reminders boolean not null default true;

create table if not exists public.saved_events (
  user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

create index if not exists saved_events_event_idx
  on public.saved_events (event_id);

create table if not exists public.event_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_reviews_user_event_unique unique (user_id, event_id)
);

create index if not exists event_reviews_event_idx
  on public.event_reviews (event_id);
create index if not exists event_reviews_user_idx
  on public.event_reviews (user_id);

alter table public.saved_events enable row level security;
alter table public.event_reviews enable row level security;

commit;
