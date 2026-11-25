# Evidence — TASK-7 whole-hour estimates

- Revision: `dcff23897c401d5b3771a3a1bb23aad10be1a120`
- PR base / HW 1.1 harness: `449502b28ed11e529920decc41457f2f45ff4ec1`
- Ran: 2026-11-25T17:42:04+02:00 (Europe/Kyiv), macOS arm64, Node v26.13.0.
- Who ran it: Codex (GPT-6), driven by Vedula Volodymyr (@vvedula-svg).
- Working tree was clean before the checks. Only evidence files are added after this revision.
- Outputs below are captured from the commands; only the local checkout path is normalized to `<checkout>`.

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 <checkout>


 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  17:42:05
   Duration  502ms (tests 55%, import 27%, transform 11%, worker 7%)
```

Exit code: 0

## `node --test scripts/migration-guard.test.mjs`

```text
✔ Edit blocks an existing migration with a reason (234.944333ms)
✔ Write blocks an existing migration with a reason (215.156167ms)
✔ MultiEdit blocks an existing migration with a reason (239.454458ms)
✔ normalizes absolute, traversal, Windows separator and symlink paths (918.537334ms)
✔ allows a new migration, unrelated edit and reading an old migration (634.645083ms)
✔ fails closed on malformed JSON and missing write path (426.407125ms)
ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2895.988541
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
✓ Running next.config.ts took 75ms

  Creating an optimized production build ...
✓ Compiled successfully in 164ms
  Running TypeScript ...
  Finished TypeScript in 1264ms ...
  Collecting page data using 6 workers ...
  Generating static pages using 6 workers (0/3) ...
✓ Generating static pages using 6 workers (3/3) in 217ms
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

## `git diff --check 449502b28ed11e529920decc41457f2f45ff4ec1 dcff23897c401d5b3771a3a1bb23aad10be1a120`

```text
(no output)
```

Exit code: 0

## Red local trace gate before evidence

Command:

```sh
node docs/ai/ci/trace-gate.mjs --base 449502b28ed11e529920decc41457f2f45ff4ec1 --head dcff23897c401d5b3771a3a1bb23aad10be1a120 --title "TASK-7 Reject estimates that are not whole hours" --branch TASK-7-whole-hour-estimates --key-pattern "TASK-[0-9]+"
```

```text
key TASK-7 (from the PR title)
1 commit(s), 1 with Assisted-by
::error::no commit carries an Evidence: trailer (e.g. Evidence: docs/evidence/<KEY>/<slice>.md)
trace gate: FAIL (1 error(s))
```

Exit code: 1 (expected: code commit has Refs but no Evidence trailer).

This is a **local** run, not the GitHub Actions red-run deliverable. After this file is committed with an Evidence trailer, rerun the same command with `--head HEAD`; the code SHA above remains the verified revision.

## Acceptance coverage

- `lib/tasks.test.ts`: accepts 1 and 40; rejects 0, 41, 1.5, strings, null, booleans, arrays, objects and non-finite numbers with the exact RuleViolation; checks no insertion; omission returns null.
- `app/api/tasks/route.test.ts`: real POST handler + real SQLite migrations; accepted boundaries return 201, rejected JSON values return 422 and exact error without insertion, omission returns 201 with null.
- Regression proof before implementation: 23 new expectation failures and 10 passes; after fix 33 passes. The regression run used the new tests with the original validation in an uncommitted draft; it is not attributed to the final code SHA.

## Not verified yet

GitHub Actions red/green runs, another human’s PR review, and the merge have not happened at the time this evidence was recorded. Local checks and agent review are not substitutes. No browser/UI verification was needed because UI changes are outside TASK-7 scope. CI is configured for Node 24; these local checks used Node 26.13.0.
