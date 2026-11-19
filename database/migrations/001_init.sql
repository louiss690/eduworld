-- ═══════════════════════════════════════════════════════════════════════════
-- EduWorld — initial schema
-- PostgreSQL 15+ (Supabase)
-- Run with:  supabase db push   (or paste into the Supabase SQL editor)
-- ═══════════════════════════════════════════════════════════════════════════

begin;

-- ── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists citext;         -- case-insensitive emails

-- ── Enums ───────────────────────────────────────────────────────────────────
create type user_role as enum ('student', 'teacher', 'admin');
create type course_level as enum ('beginner', 'intermediate', 'advanced');
create type material_kind as enum ('video', 'document', 'link', 'audio');
create type question_type as enum ('multiple_choice', 'true_false', 'short_answer');
create type progress_status as enum ('in_progress', 'completed');
create type notification_type as enum ('enrollment', 'quiz_result', 'achievement', 'course_update', 'security');
create type report_status as enum ('open', 'resolved', 'dismissed');
create type report_target as enum ('course', 'lesson', 'quiz', 'ai_message', 'user');

-- ── Reference tables ────────────────────────────────────────────────────────

create table countries (
  code text primary key,
  name text not null
);

create table languages (
  code text primary key,
  name text not null,
  native_name text not null,
  available boolean not null default true
);

create table educational_levels (
  id text primary key,
  slug text not null unique,
  name text not null,
  display_order int not null default 0
);

create table subjects (
  id text primary key,
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  description text not null default '',
  image_url text,
  icon_key text not null default 'book-open'
);

-- ── Users & profiles ────────────────────────────────────────────────────────

create table users (
  id uuid primary key default gen_random_uuid() references auth.users (id) on delete cascade,
  email citext not null unique,
  name text not null,
  role user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table student_profiles (
  user_id uuid primary key references users (id) on delete cascade,
  country_code text references countries (code),
  language_code text references languages (code),
  education_level_id text references educational_levels (id),
  bio text,
  updated_at timestamptz not null default now()
);

create table teacher_profiles (
  user_id uuid primary key references users (id) on delete cascade,
  bio text,
  subject_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- ── Catalog ─────────────────────────────────────────────────────────────────

create table courses (
  id text primary key,
  slug text not null unique,
  title text not null,
  subject_id text not null references subjects (id),
  level course_level not null default 'beginner',
  format text not null default 'course',
  description text not null default '',
  long_description text not null default '',
  image_url text,
  instructor jsonb,
  published boolean not null default true,
  featured boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index courses_subject_idx on courses (subject_id);
create index courses_level_idx on courses (level);
create index courses_published_idx on courses (published) where published;

create table lessons (
  id text primary key,
  course_id text not null references courses (id) on delete cascade,
  title text not null,
  description text not null default '',
  objectives jsonb not null default '[]',
  blocks jsonb not null default '[]',
  minutes int not null default 10 check (minutes > 0),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index lessons_course_idx on lessons (course_id, position);

create table learning_materials (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references lessons (id) on delete cascade,
  kind material_kind not null,
  title text not null,
  url text not null,
  size_bytes bigint,
  downloadable boolean not null default false,
  created_at timestamptz not null default now()
);

create index materials_lesson_idx on learning_materials (lesson_id);

-- ── Assessments ─────────────────────────────────────────────────────────────

create table quizzes (
  id text primary key,
  course_id text not null references courses (id) on delete cascade,
  lesson_id text references lessons (id) on delete set null,
  title text not null,
  description text not null default '',
  passing_score int not null default 60 check (passing_score between 0 and 100),
  time_limit_minutes int check (time_limit_minutes > 0),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index quizzes_course_idx on quizzes (course_id);

-- Questions deliberately sit behind RLS: correct answers are never exposed
-- to students through the API.
create table questions (
  id text primary key,
  quiz_id text not null references quizzes (id) on delete cascade,
  type question_type not null,
  prompt text not null,
  options jsonb not null default '[]',
  correct_index int,
  correct_answer text,
  explanation text not null default '',
  position int not null default 0
);

create index questions_quiz_idx on questions (quiz_id, position);

-- ── Learning activity ───────────────────────────────────────────────────────

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  course_id text not null references courses (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  last_accessed_at timestamptz not null default now(),
  progress_pct numeric not null default 0 check (progress_pct between 0 and 100),
  unique (user_id, course_id)
);

create index enrollments_user_idx on enrollments (user_id);
create index enrollments_course_idx on enrollments (course_id);

create table learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  course_id text not null references courses (id) on delete cascade,
  lesson_id text not null references lessons (id) on delete cascade,
  status progress_status not null default 'in_progress',
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index progress_user_idx on learning_progress (user_id);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  quiz_id text not null references quizzes (id) on delete cascade,
  score_pct numeric not null check (score_pct between 0 and 100),
  passed boolean not null,
  correct_count int not null default 0,
  total int not null default 0,
  answers jsonb not null default '[]',
  completed_at timestamptz not null default now()
);

create index attempts_user_idx on quiz_attempts (user_id);
create index attempts_quiz_idx on quiz_attempts (quiz_id);

create table student_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references quiz_attempts (id) on delete cascade,
  question_id text not null references questions (id) on delete cascade,
  given jsonb not null,
  correct boolean not null,
  explanation text not null default ''
);

create index answers_attempt_idx on student_answers (attempt_id);

-- ── AI conversations ────────────────────────────────────────────────────────

create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index conversations_user_idx on ai_conversations (user_id, updated_at desc);

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index messages_conversation_idx on ai_messages (conversation_id, created_at);

-- ── Achievements, notifications, reports ────────────────────────────────────

create table achievements (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default ''
);

create table user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  achievement_id text not null references achievements (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create index user_achievements_user_idx on user_achievements (user_id);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on notifications (user_id, created_at desc);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references users (id) on delete cascade,
  target_type report_target not null,
  target_id text not null,
  reason text not null,
  details text,
  status report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index reports_status_idx on reports (status, created_at desc);

-- ── updated_at triggers ─────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_student_profiles_updated before update on student_profiles
  for each row execute function set_updated_at();
create trigger trg_teacher_profiles_updated before update on teacher_profiles
  for each row execute function set_updated_at();
create trigger trg_learning_progress_updated before update on learning_progress
  for each row execute function set_updated_at();
create trigger trg_conversations_updated before update on ai_conversations
  for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Model: catalog is readable by everyone (published only); personal data is
-- owned by the user; staff (teacher/admin) have elevated permissions. The
-- application also checks roles server-side — RLS is the second line.

alter table countries enable row level security;
alter table languages enable row level security;
alter table educational_levels enable row level security;
alter table subjects enable row level security;
alter table users enable row level security;
alter table student_profiles enable row level security;
alter table teacher_profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table learning_materials enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table enrollments enable row level security;
alter table learning_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table student_answers enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;

-- public catalog reads
create policy countries_public_read on countries for select using (true);
create policy languages_public_read on languages for select using (true);
create policy levels_public_read on educational_levels for select using (true);
create policy subjects_public_read on subjects for select using (true);
create policy courses_public_read on courses for select using (published);
create policy lessons_public_read on lessons for select using (
  exists (select 1 from courses c where c.id = lessons.course_id and c.published)
);
create policy achievements_public_read on achievements for select using (true);

-- questions: no anon/authenticated read — handled server-side via service role
create policy questions_staff_write on questions for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));

-- users: self-service + admin
create policy users_self_read on users for select using (id = auth.uid());
create policy users_admin_all on users for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role = 'admin'));

-- profiles: self read/update
create policy profiles_self_read on student_profiles for select using (user_id = auth.uid());
create policy profiles_self_update on student_profiles for update using (user_id = auth.uid());
create policy teacher_profiles_self_read on teacher_profiles for select using (user_id = auth.uid());
create policy teacher_profiles_self_update on teacher_profiles for update using (user_id = auth.uid());

-- learning activity: own rows only
create policy enrollments_own on enrollments for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy progress_own on learning_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy attempts_own on quiz_attempts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy answers_own on student_answers for all
  using (exists (select 1 from quiz_attempts a where a.id = attempt_id and a.user_id = auth.uid()))
  with check (exists (select 1 from quiz_attempts a where a.id = attempt_id and a.user_id = auth.uid()));

-- conversations: owner only; teachers/admins may view to support students
create policy conversations_own on ai_conversations for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy messages_own on ai_messages for all
  using (exists (select 1 from ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()))
  with check (exists (select 1 from ai_conversations c where c.id = conversation_id and c.user_id = auth.uid()));

-- achievements: own reads; staff write
create policy user_achievements_own_read on user_achievements for select using (user_id = auth.uid());
create policy user_achievements_staff_write on user_achievements for insert
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));

-- notifications: own
create policy notifications_own on notifications for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reports: any authenticated user may file; staff resolve
create policy reports_insert on reports for insert with check (reporter_user_id = auth.uid());
create policy reports_staff_read on reports for select
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));
create policy reports_staff_update on reports for update
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));

-- staff content management (courses/lessons/materials/quizzes)
create policy courses_staff_write on courses for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));
create policy lessons_staff_write on lessons for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));
create policy materials_staff_write on learning_materials for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));
create policy quizzes_staff_write on quizzes for all
  using (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')))
  with check (exists (select 1 from users u where u.id = auth.uid() and u.role in ('teacher', 'admin')));

commit;
