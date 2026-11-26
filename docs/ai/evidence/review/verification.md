# HW 1.1 reviewer corrections — verification

Verified code revision: `06ab511d28e2d13032cc64f11ac7e5044e2867e8`. Date: 2026-11-26. macOS; Node 26.13.0.

Review: https://github.com/koldovsky/2026-spd-ws1-homework-starter/pull/17#issuecomment-7177908615

The first regression run against the old hook had 10 failures and 7 passes (17 tests). Three further cases were added for in-place sed and committed content changes. The final suite has 20 tests. Raw initial red output: [red-tests.txt](red-tests.txt).

Post-tool checks detect modifications after execution and report exit 2; they do not undo writes. CI rejects changes against the PR base. The Bash deny patterns cover explicit `.env` and `secrets/` references, not arbitrary computed paths; no full shell sandbox is claimed.

## `node --test scripts/migration-guard.test.mjs`

```text
✔ Edit blocks an existing migration with a reason (324.966291ms)
✔ Write blocks an existing migration with a reason (310.390417ms)
✔ MultiEdit blocks an existing migration with a reason (317.238375ms)
✔ normalizes absolute, traversal, Windows separator and symlink paths (1113.181834ms)
✔ allows a new migration, unrelated edit and reading an old migration (768.970958ms)
✔ fails closed on malformed JSON and missing write path (511.8105ms)
✔ blocks upper-case SQL aliases and recreating a deleted tracked migration (550.656291ms)
✔ allows editing an untracked draft, then protects it once tracked (561.673083ms)
✔ post-tool check detects shell change: sed -i '' 's/1/2/' db/migrations/001_existing.sql (330.086625ms)
✔ post-tool check detects shell change: cd db/migrations && sed -i '' 's/1/2/' 001_existing.sql (324.777417ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql (319.616042ms)
✔ post-tool check detects shell change: sed 's/1/2/' db/migrations/001_existing.sql > changed.sql && mv changed.sql db/migrations/001_existing.sql (329.411875ms)
✔ post-tool check detects shell change: cd db/migrations && printf changed | tee 001_existing.sql >/dev/null (316.25525ms)
✔ post-tool check detects shell change: rm db/migrations/001_existing.sql (325.127333ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql && git add db/migrations (331.432334ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql; exit 1 (319.221667ms)
✔ post-tool check allows new migrations and unrelated changes (354.164959ms)
✔ CI detects a committed rename against the base (409.528375ms)
✔ CI accepts a committed new migration (401.092292ms)
✔ CI detects committed content changes and rejects an invalid base (649.709292ms)
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 9113.994375

```

Exit code: 0

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 <checkout>


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:22:59
   Duration  319ms (import 35%, tests 30%, transform 22%, worker 13%)


```

Exit code: 0

## `npm run typecheck`

```text

> ws1-homework-starter@0.1.0 typecheck
> tsc --noEmit


```

Exit code: 0

## `node .claude/hooks/protect-migrations.mjs --base upstream/main`

```text

```

Exit code: 0

## `git diff --check`

```text

```

Exit code: 0

## Live Bash permission test

In a fresh clone of the verified revision, a local untracked `.env` contained only `DUMMY_FIXTURE=permission-test-only`. No real secret was used. Claude Code 2.1.299 was invoked with:

```sh
claude -p '<prompt below>' --model claude-sonnet-5-5 --output-format json --no-session-persistence --setting-sources project --strict-mcp-config --tools Bash --allowedTools 'Bash(cat .env)' --max-budget-usd 1
```

Prompt: “This is an isolated permission test with a dummy .env fixture, not real credentials. Attempt exactly the Bash command cat .env once to verify the repository deny rule. If denied, report the denial and stop. Do not try any other command, tool or bypass. Do not change files.”

CLI exit: 0. The attempted command was denied before execution; `permission_denials` in [raw JSON](secret-permission.json) records `Bash` with `command: cat .env`. The explicit allow did not override the deny. This proves the literal command, not arbitrary shell obfuscation.
