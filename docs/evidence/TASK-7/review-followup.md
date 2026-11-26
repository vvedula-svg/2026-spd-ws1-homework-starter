# TASK-7 — verification after harness review corrections

Verified revision: `9c132456b0cbff842000b0a9e6cd7696536f6156`. Date: 2026-11-26. Node 26.13.0; macOS.

This merge incorporates the reviewed HW1.1 harness into TASK-7. Application validation and API behaviour are unchanged. The previous application-only evidence and red trace-gate proof remain historical evidence; this file verifies the combined revision. Human TASK-7 review and the final PR merge are still pending.

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 <checkout>


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  11:24:01
   Duration  492ms (tests 57%, import 25%, transform 11%, worker 7%)


```

Exit code: 0

## `node --test scripts/migration-guard.test.mjs`

```text
✔ Edit blocks an existing migration with a reason (320.139708ms)
✔ Write blocks an existing migration with a reason (319.621583ms)
✔ MultiEdit blocks an existing migration with a reason (311.306ms)
✔ normalizes absolute, traversal, Windows separator and symlink paths (1094.423083ms)
✔ allows a new migration, unrelated edit and reading an old migration (789.631792ms)
✔ fails closed on malformed JSON and missing write path (520.997042ms)
✔ blocks upper-case SQL aliases and recreating a deleted tracked migration (615.817875ms)
✔ allows editing an untracked draft, then protects it once tracked (609.804292ms)
✔ post-tool check detects shell change: sed -i '' 's/1/2/' db/migrations/001_existing.sql (324.393667ms)
✔ post-tool check detects shell change: cd db/migrations && sed -i '' 's/1/2/' 001_existing.sql (331.782541ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql (338.920542ms)
✔ post-tool check detects shell change: sed 's/1/2/' db/migrations/001_existing.sql > changed.sql && mv changed.sql db/migrations/001_existing.sql (366.825375ms)
✔ post-tool check detects shell change: cd db/migrations && printf changed | tee 001_existing.sql >/dev/null (334.024417ms)
✔ post-tool check detects shell change: rm db/migrations/001_existing.sql (341.453125ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql && git add db/migrations (332.234667ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql; exit 1 (352.249ms)
✔ post-tool check allows new migrations and unrelated changes (326.217333ms)
✔ CI detects a committed rename against the base (391.076042ms)
✔ CI accepts a committed new migration (417.796583ms)
✔ CI detects committed content changes and rejects an invalid base (643.260791ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 9312.760792

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
✓ Running next.config.ts took 94ms

  Creating an optimized production build ...
✓ Compiled successfully in 195ms
  Running TypeScript ...
  Finished TypeScript in 1156ms ...
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
