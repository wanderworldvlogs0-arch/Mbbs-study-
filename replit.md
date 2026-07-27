# Dr.tragicMFA (MedMaster AI)

Study companion for MBBS students — flashcards, quizzes, an AI doubt-solver, and subject tracking.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema (source of truth): `lib/db/src/schema/` — `users.ts`, `sessions.ts`, `subjects.ts`, `chapters.ts`, `progress.ts` (`userChapterProgress` + `dailyActivity`)
- Seed data for the subjects catalog + Anatomy's chapters: `lib/db/src/seed.ts` (`pnpm --filter @workspace/db run seed`)
- API contract (source of truth): `lib/api-spec/openapi.yaml`
- API server: `artifacts/api-server` — routes in `src/routes/{auth,subjects,dashboard}.ts`, helpers in `src/lib/{auth,dashboard}.ts`
- Real frontend (hand-built, not yet registered as a Replit artifact — see Gotchas): `artifacts/web` — pages in `src/pages/`, graduated shared layout in `src/components/layout/`
- Design mockups (not wired to real data): `artifacts/mockup-sandbox/src/components/mockups/med-master-ai/` — QuizSection, Flashcards, AIDoubtSolver, Subscription still need to be graduated into `artifacts/web`

## Architecture decisions

- Auth uses opaque session tokens in an httpOnly cookie, not JWTs. Only the SHA-256 hash of the token is stored (`sessions.id`), so a DB leak alone can't be replayed as a live session.
- Passwords are hashed with Node's built-in `crypto.scrypt` — no extra dependency (bcrypt/argon2) was added.
- `lib/api-zod`'s zod/type schemas were hand-written to match `openapi.yaml` since codegen (`orval`) couldn't be run in the environment that authored them (no network access). Regenerate with `pnpm --filter @workspace/api-spec run codegen` to get the canonical versions — should be a no-op diff if `openapi.yaml` didn't change further.
- Subject-level `progressPercent` is computed on read (average of that subject's chapter `progressPercent` for the current user), not stored — keeps chapter progress as the single source of truth.
- Only Anatomy has real chapter data seeded; the other 18 subjects show real (zero) progress with an empty chapter list until their chapters are authored and added to `seed.ts`. That's a content task, not a coding one.
- The dashboard's "Today's Goals" targets (3 chapters / 20 MCQs / 2 videos) are hardcoded constants (`DAILY_GOAL_TARGETS` in `src/lib/dashboard.ts`), not yet user-configurable.
- Dropped from the Dashboard mockup because nothing backs them yet (rather than fake the numbers): Level/XP, Questions Solved, Accuracy, the "Continue Learning" hero card, "Upcoming" (flashcards due / mock test), and the leaderboard. These depend on the Quiz/Flashcards features and a points system that haven't been built.

## Product

- **Working end-to-end:** sign up, sign in, sign out, session persistence; browsing all 19 subjects with real per-user progress; marking Anatomy chapters complete/incomplete; a real Dashboard with a persisted study timer, daily goals, subject mastery ranking, and a real weekly streak.
- **Designed but not wired:** Quiz Section, Flashcards, AI Doubt Solver, Subscription (mockups only, in `mockup-sandbox`).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Deploying outside Replit (GitHub + Render + PWABuilder)

This also runs as a normal GitHub-hosted project, no Replit runtime required:

1. Push this repo to GitHub.
2. Deploy on [Render](https://render.com) using the included `render.yaml` (Render calls this a "Blueprint" — New → Blueprint → pick the repo). It provisions one web service (API + the built frontend, served from the same origin) and one free Postgres database, and runs the DB push + seed automatically on each deploy.
   - **Heads up:** Render's free Postgres expires 30 days after creation (then a 14-day grace period before deletion). Fine for testing; for something you want to keep, either upgrade that database to a paid instance, or use a permanent-free external Postgres (e.g. [Neon](https://neon.tech)) and set its connection string as the `DATABASE_URL` env var on the Render service instead of using `render.yaml`'s built-in database.
   - Free web services also spin down after ~15 minutes idle and take about a minute to wake back up on the next request.
3. Once it's live at a Render URL, the app is already an installable PWA (`artifacts/web/public/manifest.json` + `sw.js`). Feed that URL into [PWABuilder](https://www.pwabuilder.com) to generate Android/iOS/Windows app packages. PWABuilder packages an already-deployed site — it doesn't build or host anything itself.
4. Swap the placeholder icons in `artifacts/web/public/icon-192.png` / `icon-512.png` for real artwork before shipping anywhere public.

## Gotchas

- `artifacts/web` was hand-written outside Replit (no network access to call `createArtifact`), so it has **no `.replit-artifact/artifact.toml`** and isn't yet a registered/routed artifact. In Replit, ask the Agent to run `createArtifact({ artifactType: "react-vite", slug: "web", previewPath: "/", title: "Dr.tragicMFA" })`, then either point it at these files or have it graduate the remaining mockups itself — the backend already exists, so this should move fast.
- Run `pnpm --filter @workspace/db run push` after pulling this in, to create the tables, then `pnpm --filter @workspace/db run seed` to load the subjects catalog + Anatomy's chapters.
- Run `pnpm --filter @workspace/api-spec run codegen` to regenerate `lib/api-zod`/`lib/api-client-react` from the updated `openapi.yaml` (replaces the hand-written provisional files, which are clearly marked).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
