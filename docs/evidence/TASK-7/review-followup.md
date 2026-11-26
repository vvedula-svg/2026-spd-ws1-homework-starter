# TASK-7 — verification after harness review corrections

Verified revision: `d27c106dd7a84f9ebcff872ef0fef57f6a82222c`. Date: 2026-11-26. Node 26.13.0; macOS.

This merge incorporates all HW1.1 reviewer corrections, including the follow-up index check for staged new migrations. Application validation and API behaviour are unchanged. Previous application-only evidence and the red trace-gate proof remain historical evidence; this file verifies the combined revision. Human TASK-7 review and the final PR merge are still pending.

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 <checkout>


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  11:26:07
   Duration  491ms (tests 53%, import 28%, transform 11%, worker 8%)


```

Exit code: 0

## `node --test scripts/migration-guard.test.mjs`

```text
✔ Edit blocks an existing migration with a reason (321.474875ms)
✔ Write blocks an existing migration with a reason (303.144917ms)
✔ MultiEdit blocks an existing migration with a reason (314.422458ms)
✔ normalizes absolute, traversal, Windows separator and symlink paths (1007.358083ms)
✔ allows a new migration, unrelated edit and reading an old migration (839.284875ms)
✔ fails closed on malformed JSON and missing write path (541.240125ms)
✔ blocks upper-case SQL aliases and recreating a deleted tracked migration (559.396583ms)
✔ allows editing an untracked draft, then protects it once tracked (579.176083ms)
✔ post-tool check detects shell change: sed -i '' 's/1/2/' db/migrations/001_existing.sql (321.797459ms)
✔ post-tool check detects shell change: cd db/migrations && sed -i '' 's/1/2/' 001_existing.sql (331.749416ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql (333.773667ms)
✔ post-tool check detects shell change: sed 's/1/2/' db/migrations/001_existing.sql > changed.sql && mv changed.sql db/migrations/001_existing.sql (324.986042ms)
✔ post-tool check detects shell change: cd db/migrations && printf changed | tee 001_existing.sql >/dev/null (321.648166ms)
✔ post-tool check detects shell change: rm db/migrations/001_existing.sql (328.099959ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql && git add db/migrations (330.173167ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql; exit 1 (332.514958ms)
✔ post-tool check allows new migrations and unrelated changes (353.936667ms)
✔ CI detects a committed rename against the base (435.768417ms)
✔ CI accepts a committed new migration (430.470583ms)
✔ CI detects committed content changes and rejects an invalid base (623.391583ms)
✔ post-tool check detects edits to a newly staged migration (374.436916ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 9546.222167

```

Exit code: 0

## `npm run typecheck`

```text

> ws1-homework-starter@0.1.0 typecheck
> tsc --noEmit


```

Exit code: 0

## `npm run build`

```text

> ws1-homework-starter@0.1.0 build
> next build

▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 58ms

  Creating an optimized production build ...
✓ Compiled successfully in 169ms
  Running TypeScript ...
  Finished TypeScript in 1152ms ...
  Collecting page data using 6 workers ...
  Generating static pages using 6 workers (0/3) ...
✓ Generating static pages using 6 workers (3/3) in 216ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/tasks
└ ƒ /api/tasks/[id]


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand


```

Exit code: 0

## `node .claude/hooks/protect-migrations.mjs --base main`

```text

```

Exit code: 0

## `git diff --check main...HEAD`

```text

```

Exit code: 0
