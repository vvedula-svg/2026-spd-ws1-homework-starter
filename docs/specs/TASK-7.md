# TASK-7 — Whole-hour estimates

Requirement: [TASK-7](../tickets/TASK-7.md).

## Approval

Approved by Vedula Volodymyr on 2026-11-25 in the task conversation: “Погоджую специфікацію”. The approved scope includes explicit null, booleans and other non-number inputs being invalid. Codex drafted the spec; the participant made the approval decision.

## Behaviour and acceptance criteria

- A supplied `estimateHours` is a JavaScript number, an integer, and between 1 and 40 inclusive.
- Accept 1 and 40 and persist the same value; POST responds 201.
- Reject 0, 41, 1.5, `"3"`, and `"abc"` with `RuleViolation("estimateHours must be a whole number 1..40")`.
- The API responds 422 with `{ "error": "estimateHours must be a whole number 1..40" }`; a rejected request inserts no task.
- Omission remains allowed and returns/stores `estimateHours: null`.
- Explicit null, booleans, arrays, and objects are invalid. At the business function boundary, NaN and infinities are invalid too. These are consequences of “anything else is a validation error”; non-finite numbers are not valid JSON API values.
- An explicit JavaScript `undefined` is treated like omission, matching the existing optional field contract.

## Verification

- Table-driven unit tests in `lib/tasks.test.ts` cover every ticket value, omission, invalid types and non-finite numbers, checking no insertion on rejection.
- Route tests exercise the real POST handler and real in-memory SQLite, checking 201, 422, the exact response and database contents.
- Run `npm test`, `npm run typecheck`, and `npm run build`; retain outputs and exit codes for the final code revision.
- Show a trace-gate failure without evidence and a pass after committing evidence. Record GitHub Actions runs separately from local checks.

## Non-goals

No database migration, schema/check changes, UI changes, title changes, status transition changes, general API validation refactor, or new runtime dependencies.

## Delivery

Branch `TASK-7-whole-hour-estimates`; PR inside the participant's fork. Every commit carries `Refs: TASK-7` and agent-assisted commits carry `Assisted-by:`. The evidence commit names the tested code commit and changes evidence files only. Another human reviews; merge with a merge commit to preserve evidence SHAs.
