# EduWorld — Education Without Borders, Knowledge Without Limits

EduWorld is an international, AI-powered educational platform that makes quality
education accessible to every learner, everywhere — regardless of country,
financial background, language or access to resources.

This is a fully functional full-stack MVP:

- Professional, responsive marketing site (home, subjects, courses, about, help, contact)
- Student registration, login, email verification flow, forgot/reset password, profile settings
- Student dashboard with progress, recommendations, achievements and activity
- Searchable learning library with facet filters
- Courses with lessons, objectives, content blocks, exercises and progress tracking
- Quiz engine (multiple choice / true-false / short answer) with server-side grading and instant feedback
- Personal AI Tutor with conversation history, suggestion prompts, rate limiting and content safety
- Teacher portal (create courses and lessons) and Admin dashboard (manage users, published content, reports)
- PWA: installable, service worker, offline page cache, offline indicator
- PostgreSQL schema with migrations, RLS policies, indexes and seed content

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 |
| Backend | Next.js Route Handlers (server-side business logic) |
| Database / Auth | PostgreSQL on Supabase (with Supabase Auth) |
| AI | OpenAI-compatible provider abstraction (OpenAI, OpenRouter, Groq, Azure…) |
| PWA | Web manifest + service worker |
| Tests | Vitest |
| Version control | Git |

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

The app runs immediately in **Demo mode** with empty credentials: local data,
simulated auth, and a clearly labelled demo AI tutor.

To enable the production experience, fill in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (never exposed to the browser) |
| `OPENAI_API_KEY` | AI provider key (OpenAI-compatible) |
| `OPENAI_BASE_URL` | Endpoint (defaults to `https://api.openai.com/v1`) |
| `OPENAI_MODEL` | Model id (defaults to `gpt-4o-mini`) |
| `DEMO_AUTH_SECRET` | Random 64-hex secret used to sign demo session cookies |

### 3. Run

```bash
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

### 4. Tests

```bash
npm test
```

---

## Connecting Supabase (database + auth)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the migrations in order:
   - `database/migrations/001_init.sql` — full schema (22 tables, RLS, triggers, indexes)
   - `database/migrations/002_seed.sql` — reference data + demonstration catalog
3. Copy the project URL and anon key into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`), and the service-role key (`SUPABASE_SERVICE_ROLE_KEY`).
4. In Supabase **Authentication → Providers**, enable **Email** and decide on
   "Confirm email" behaviour (recommended: on).
5. Run `database/migrations/003_student_features.sql` too (subject interests,
   bookmarks).
6. Restart the dev server. The app now uses Supabase Auth + PostgreSQL.
   Demo-mode badges disappear.

> Note: the Supabase-backed store is exercised only when credentials are present.
> The local demo store (`services/data/localStore.ts`) shares the same interface,
> so all pages/APIs work in both modes.

## Connecting the AI tutor

Add an OpenAI-compatible key to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

The tutor endpoint is `POST /api/tutor/chat`. It includes request validation,
per-IP+user rate limiting, topic whitelisting and a Socratic system prompt.
If no key is configured, the tutor refuses to respond (HTTP 503) and the UI
shows a configuration-required state — the platform never fabricates AI
responses. A clearly-labelled built-in demo tutor can be enabled explicitly
for development with `ALLOW_DEMO_TUTOR=true`.

## Database schema

The relational design (see `database/migrations/001_init.sql`) covers:
users, student/teacher profiles, countries, languages, educational levels,
subjects, courses, enrollments, lessons, learning materials, quizzes,
questions, quiz attempts, student answers, learning progress, AI conversations,
AI messages, achievements, notifications and reports.

Key design points:

- Primary/foreign keys on all relations, `ON DELETE CASCADE` where appropriate
- Unique constraints (e.g. `(user_id, lesson_id)` progress, `(user_id, course_id)` enrollment)
- Indexes on all foreign keys and common query paths
- Row Level Security enabled on every table (self-service + staff policies)
- `updated_at` triggers; JSONB for structured lesson blocks and quiz answers
- Correct answers live only in the `questions` table behind RLS — they are
  never exposed to the quiz UI before submission

## Project structure

```
app/                      # Next.js App Router (pages + API routes)
  (site)/                 #   marketing + learner pages (header/footer shell)
  api/                    #   route handlers (auth, courses, progress, quiz, tutor, admin)
components/               # Reusable UI (layout, auth, courses, quiz, tutor…)
data/demo.ts              # Single source for demo catalog content
database/migrations/      # SQL schema + seed
features/                 # (reserved) feature slices
hooks/                    # (reserved) shared hooks
lib/                      # env, utils, rate limiting, passwords
services/                 # Business logic: data stores, auth, quizzes, achievements, AI provider
types/                    # Domain types (mirror the SQL schema)
public/                   # Static assets, PWA manifest + service worker
tests/                    # Vitest unit tests
```

## Security notes

- Credentials live only in server-side env vars; nothing secret reaches the client
- All APIs validate input with zod, rate-limit per client, and check sessions
- Authorization is role-based (`student` / `teacher` / `admin`) enforced in
  route handlers, plus database RLS as a second line
- Service worker never caches API responses; quiz answers are never sent to the client
- Security headers set in `next.config.ts` (nosniff, frame-deny, referrer policy)
- Content safety filter on tutor input; Socratic system prompt prevents answer-dumping
- Minimal personal data collection, no public student profiles

## Offline learning (PWA)

- Open the site, install it from the browser menu
- The service worker pre-caches the shell; visited pages become available offline
- When connectivity returns, an offline banner disappears automatically

## Roadmap

- French, Spanish, Portuguese, Arabic, Swahili, Twi language packs (i18n architecture ready)
- Country-specific curricula (library filters already accept country/language)
- Real educator content on top of the demo catalog
- File uploads for materials, full quiz authoring UI, classroom features
- Supabase storage for uploaded educational materials

---
© EduWorld — built as a foundation for a global educational technology company.
