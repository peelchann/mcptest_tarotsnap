-- supabase/migrations/20260428_anonymous_readings.sql
-- Creates the anonymous_readings table for product-usage logging.
-- See docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md.

create table public.anonymous_readings (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  anon_id         uuid not null,
  ip_hash         text not null,
  user_agent      text,
  referrer        text,
  locale          text,
  question_text   text,
  spread_type     text,
  cards_drawn     jsonb,
  ai_response     text,
  ai_model        text,
  ai_latency_ms   integer,
  ai_token_usage  jsonb,
  error           text
);

create index anonymous_readings_anon_id_idx
  on public.anonymous_readings (anon_id, created_at desc);

create index anonymous_readings_created_at_idx
  on public.anonymous_readings (created_at desc);

alter table public.anonymous_readings enable row level security;

create policy anon_insert_only
  on public.anonymous_readings for insert
  to anon with check (true);

create policy authenticated_insert_only
  on public.anonymous_readings for insert
  to authenticated with check (true);
