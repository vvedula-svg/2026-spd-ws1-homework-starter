<!-- owner: @vvedula-svg · why: make fresh agent sessions safe and reproducible · review-by: 2027-03-25 -->
# Team Tasks — agent entry point

## Commands
- Install: `npm ci` (Node >=22.13; Node 24 recommended).
- Tests: `npm test`; types: `npm run typecheck`; production build: `npm run build`.
- Hook checks: `node --test scripts/migration-guard.test.mjs`.
- Development: `npm run dev`; API: `/api/tasks`.

## Boundaries
- Read the ticket and acceptance criteria before editing; keep changes scoped.
- Git-tracked `db/migrations/*.sql` files are immutable, including comments. Add a new numbered migration only with human review.
- Never bypass a blocked hook with Bash, another tool, or changes to the harness.
- Do not read secrets, reset the database, push, publish, or merge without explicit authorization.
- Preserve title and status rules unless the ticket explicitly changes them.
- Add regression tests for behaviour changes; report commands, exit codes and known gaps.
- Never claim a test, review, approval or CI run happened without evidence.
- Keep `AGENTS.md` as the single root instruction file; no `CLAUDE.md` or `CLAUDE.local.md`.

## Read when relevant
- Ownership and autonomy: `docs/ai/team-agreement.md`.
- Database changes: `.claude/rules/migrations.md`.
- Verification procedure: `.claude/skills/verify-change/SKILL.md`.
- Session handoff: `docs/ai/handoff-template.md`.
