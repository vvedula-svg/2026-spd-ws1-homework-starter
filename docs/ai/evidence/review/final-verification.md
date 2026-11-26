# Final harness verification after review

Verified revision: `3a4805bac3d5467b39c3950e2da65d15c6c3a37d`. Date: 2026-11-26.

The additional staged-migration regression failed first (expected exit 2, actual exit 0). The post-tool check now compares both HEAD and the index. CI still permits genuine new migrations. Earlier B3/B4 and dummy-secret runs apply to snapshot 06ab511; this follow-up changes only detection of unstaged edits to newly staged files.

## `node --test scripts/migration-guard.test.mjs`

```text
✔ Edit blocks an existing migration with a reason (351.816375ms)
✔ Write blocks an existing migration with a reason (347.017833ms)
✔ MultiEdit blocks an existing migration with a reason (341.981459ms)
✔ normalizes absolute, traversal, Windows separator and symlink paths (1022.28225ms)
✔ allows a new migration, unrelated edit and reading an old migration (777.114416ms)
✔ fails closed on malformed JSON and missing write path (541.129375ms)
✔ blocks upper-case SQL aliases and recreating a deleted tracked migration (638.689ms)
✔ allows editing an untracked draft, then protects it once tracked (564.834625ms)
✔ post-tool check detects shell change: sed -i '' 's/1/2/' db/migrations/001_existing.sql (320.8915ms)
✔ post-tool check detects shell change: cd db/migrations && sed -i '' 's/1/2/' 001_existing.sql (316.409041ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql (335.131125ms)
✔ post-tool check detects shell change: sed 's/1/2/' db/migrations/001_existing.sql > changed.sql && mv changed.sql db/migrations/001_existing.sql (347.232083ms)
✔ post-tool check detects shell change: cd db/migrations && printf changed | tee 001_existing.sql >/dev/null (358.719792ms)
✔ post-tool check detects shell change: rm db/migrations/001_existing.sql (319.658625ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql && git add db/migrations (361.864458ms)
✔ post-tool check detects shell change: echo changed > db/migrations/001_existing.sql; exit 1 (331.48225ms)
✔ post-tool check allows new migrations and unrelated changes (347.788125ms)
✔ CI detects a committed rename against the base (379.087458ms)
✔ CI accepts a committed new migration (383.055042ms)
✔ CI detects committed content changes and rejects an invalid base (666.022ms)
✔ post-tool check detects edits to a newly staged migration (388.672625ms)
ℹ tests 21
ℹ suites 0
ℹ pass 21
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 9713.120959

```

Exit code: 0

## `npm test`

```text

> ws1-homework-starter@0.1.0 test
> vitest run


 RUN  v5.1.0 <checkout>


 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  11:25:51
   Duration  399ms (import 33%, tests 30%, transform 24%, worker 12%)


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
