# TASK-7 — Hosted red trace-gate proof

- PR: https://github.com/vvedula-svg/2026-spd-ws1-homework-starter/pull/1
- Run: https://github.com/vvedula-svg/2026-spd-ws1-homework-starter/actions/runs/45649840305
- Tested code revision: `dcff23897c401d5b3771a3a1bb23aad10be1a120`.
- Base / harness revision: `449502b28ed11e529920decc41457f2f45ff4ec1`.
- Event: pull_request; workflow: trace gate; conclusion: failure.
- Expected failure: no commit carried an Evidence trailer. The requirement key and Refs trailer were present.
- Application checks on that revision passed: https://github.com/vvedula-svg/2026-spd-ws1-homework-starter/actions/runs/45649840320
- Evidence commits after this code revision change only files under docs/evidence/.

## Captured failing-step log

Retrieved with `gh run view 45649840305 --repo vvedula-svg/2026-spd-ws1-homework-starter --log-failed` (retrieval exit 0). The workflow itself ran `node docs/ai/ci/trace-gate.mjs` with the environment shown below and exited 1.

```text
trace gate	Key in the PR title, Refs on every commit, evidence for the head	﻿2026-11-25T15:56:42.0543056Z ##[group]Run node docs/ai/ci/trace-gate.mjs
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0543526Z ^[[36;1mnode docs/ai/ci/trace-gate.mjs^[[0m
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0922950Z shell: /usr/bin/bash -e {0}
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0923287Z env:
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0923559Z   PR_TITLE: TASK-7 Reject estimates that are not whole hours
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0923945Z   PR_BRANCH: TASK-7-whole-hour-estimates
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0924243Z   BASE_SHA: 449502b28ed11e529920decc41457f2f45ff4ec1
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0924558Z   HEAD_SHA: dcff23897c401d5b3771a3a1bb23aad10be1a120
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0924845Z   KEY_PATTERN: TASK-[0-9]+
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0925106Z   EVIDENCE_DIR: docs/evidence/
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.0925391Z ##[endgroup]
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.1281852Z key TASK-7 (from the PR title)
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.1282556Z 1 commit(s), 1 with Assisted-by
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.1296771Z ##[error]no commit carries an Evidence: trailer (e.g. Evidence: docs/evidence/<KEY>/<slice>.md)
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.1303000Z trace gate: FAIL (1 error(s))
trace gate	Key in the PR title, Refs on every commit, evidence for the head	2026-11-25T15:56:42.1306048Z ##[error]Process completed with exit code 1.
```

The final green run will be linked in the PR and submission issue. This file records the completed red run only.
