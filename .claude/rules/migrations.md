---
paths:
  - "db/migrations/**"
---
<!-- owner: @vvedula-svg · why: databases record migration names and never rerun changed files · review-by: 2027-03-25 -->
# Immutable migration history

1. Do not edit, overwrite, rename, or delete a Git-tracked SQL migration, even for comments or formatting.
2. Propose a new, sequentially numbered SQL migration and describe forward compatibility and rollback before a human reviews it.
3. Run `npm test` to exercise a fresh in-memory database. For a schema change, also show upgrading a disposable database from the previous schema.
4. Never run `npm run db:reset` against user data without explicit authorization.
5. If the migration guard blocks an edit, report its reason. Do not retry through Bash or disable the guard.

The pre-tool hook protects Git-tracked SQL files (including staged additions), resolving aliases and case variants. Untracked draft migrations remain editable. PostToolUse and PostToolUseFailure inspect the Git diff after shell commands; they detect changes after execution, do not undo them, and instruct the agent to stop for human recovery. CI also rejects modification, deletion or renaming of migrations from the PR base. These checks are not a sandbox against deliberate tampering with Git or the harness.
