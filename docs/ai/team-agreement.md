<!-- owner: @vvedula-svg · why: tie agent autonomy to independent verification · review-by: 2027-03-25 -->
# Team AI agreement — Team Tasks

## Autonomy matrix

L0: agent does not change; L1: agent proposes, human writes; L2: agent writes, human reviews every line; L3: agent writes and checks, human reviews the PR; L4: agent may merge under an explicitly approved policy. This repository grants no L4 authority.

| Change type | Level | Evidence required | Sign-off |
|---|---|---|---|
| Documentation / handoff | L3 | Links resolve, commands match package.json, no invented results | PR author |
| Regression tests | L3 | Test fails on old behaviour, passes on fix; full suite green | Human PR reviewer |
| Business validation / API | L3 | Acceptance and boundary tests, HTTP status tests, no-insertion assertions, suite + typecheck + build | Human PR reviewer |
| New database migration | L2 | Fresh DB and upgrade checks, rollback explanation, SQL reviewed line by line | Harness owner |
| Tracked migration edits | L0 | Pre-tool hook blocks tracked file edits; post-tool diff and CI detect shell rewrites; protected files unchanged | Prohibited; use a new migration |
| Harness / permission / CI changes | L2 | Hook positive/negative tests, A/B runs for behaviour changes, diff reviewed line by line | Harness owner |
| Push, release, merge, database reset | L1 | Exact target and proposed operation, current check results, explicit human authorization | Repository owner |

## Accountability and ownership

The PR author owns agent output as if they wrote it, checks evidence, and arranges human review. @vvedula-svg owns `AGENTS.md`, `.claude/**`, `docs/ai/**`, and the supporting guard/CI files; see `.github/CODEOWNERS`. A CODEOWNERS file routes reviews; enforcing required approvals additionally needs repository branch protection.

## Changing rules

1. Open a PR describing the concrete problem, affected paths and proposed rule, with owner, why and review-by.
2. Attach positive/negative hook checks; for behaviour changes attach two A and two B runs of the same prompt.
3. The harness owner reviews every line; another human reviews application changes. Raising autonomy requires a cheap independent check that runs every time.
4. Merge only with explicit authorization and passing checks. Keep the reason and evidence linked in the PR.
5. By 2027-03-25 the owner re-confirms or removes each rule in a PR; overdue rules are flagged at the next review, never silently bypassed.

## Team vs personal settings

Team settings live in committed `.claude/settings.json`. Personal preferences stay in `~/.claude/CLAUDE.md` and ignored `.claude/settings.local.json`. No repository `CLAUDE.md` or `CLAUDE.local.md`.

`next.config.ts` sets `agentRules: false` deliberately so `next dev` cannot expand the short root instructions. Consult version-matched Next.js docs when changing framework APIs.

The pre-tool migration hook blocks Edit/Write/MultiEdit on tracked SQL; untracked drafts remain editable. Post-tool hooks check Git after file/shell operations, including failed Bash commands, and CI compares migrations against the PR base. Post-tool checks detect rather than undo writes. Explicit Bash deny patterns also reject commands containing `.env` or `secrets/`, including `cat .env`; these conservative patterns may block `.env.example` commands too. They are not a complete shell sandbox for computed paths or external scripts. Human review remains necessary; no permission mode bypass is required.
