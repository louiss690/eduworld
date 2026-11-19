-- ═══════════════════════════════════════════════════════════════════════════
-- EduWorld — student-first features
--   • subject interests on student profiles (onboarding / recommendations)
--   • bookmarks (courses, lessons, materials)
-- ──────────────────────────────────────────────────────────────────────────────
-- Run after 001_init.sql and 002_seed.sql.
-- ═══════════════════════════════════════════════════════════════════════════

begin;

alter table student_profiles
  add column if not exists subject_ids text[] not null default '{}';

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  target_type text not null check (target_type in ('course', 'lesson', 'material')),
  target_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index if not exists bookmarks_user_idx on bookmarks (user_id, created_at desc);

alter table bookmarks enable row level security;

create policy bookmarks_own on bookmarks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

commit;
