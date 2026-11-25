<!-- owner: @vvedula-svg · why: preserve a ticket-to-evidence trail across every commit · review-by: 2027-03-25 -->
# Traced commits

For a traced change, the branch is `<KEY>-<slug>` and the PR title starts with the same key.
Every commit ends with trailers in its last paragraph:
- `Refs: <KEY>` — required, for example `Refs: TASK-7`.
- `Assisted-by: <tool> (<model>)` — required when an agent contributed; omit only for wholly human changes.
- `Evidence: docs/evidence/<KEY>/<slice>.md` — on the evidence commit, pointing to real command output and the tested code SHA.

Example:
```text
TASK-7 Record whole-hour validation evidence

Refs: TASK-7
Assisted-by: Codex (GPT-6)
Evidence: docs/evidence/TASK-7/whole-hours.md
```

Commit code first, then run the checks on that commit, write the raw outputs and exit codes, and commit evidence separately. Only evidence may change after the tested SHA. Any code/config/test/spec change requires fresh evidence for the new revision.

Check parsed trailers with `git log -1 --format="%(trailers)"`. Run `node docs/ai/ci/trace-gate.mjs --base origin/main --head HEAD --title "TASK-7 Whole-hour estimates" --key-pattern "TASK-[0-9]+"` before pushing. Use the actual fork PR base when it differs from origin/main.

Local trace checks do not count as GitHub Actions runs. Another human must review the PR. Merge with a merge commit to keep evidence SHAs reachable.
