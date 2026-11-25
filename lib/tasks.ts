import type { DatabaseSync } from "node:sqlite";

export type Status = "todo" | "doing" | "done";
export interface Task {
  id: number;
  title: string;
  status: Status;
  assignee: string | null;
  estimateHours: number | null;
  createdAt: string;
}

export class RuleViolation extends Error {}

const NEXT: Record<Status, Status[]> = { todo: ["doing"], doing: ["todo", "done"], done: [] };

export function createTask(db: DatabaseSync, input: { title: string; assignee?: string; estimateHours?: number }): Task {
  const title = input.title?.trim() ?? "";
  if (title.length < 1 || title.length > 120) throw new RuleViolation("title must be 1..120 characters");
  if (input.estimateHours !== undefined &&
      (!Number.isInteger(input.estimateHours) || input.estimateHours < 1 || input.estimateHours > 40)) {
    throw new RuleViolation("estimateHours must be a whole number 1..40");
  }
  const result = db
    .prepare("insert into tasks (title, assignee, estimate_hours) values (?, ?, ?)")
    .run(title, input.assignee ?? null, input.estimateHours ?? null);
  return getTask(db, Number(result.lastInsertRowid))!;
}

export function getTask(db: DatabaseSync, id: number): Task | undefined {
  const row = db.prepare("select * from tasks where id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? toTask(row) : undefined;
}

export function listTasks(db: DatabaseSync): Task[] {
  return (db.prepare("select * from tasks order by id").all() as Record<string, unknown>[]).map(toTask);
}

/** todo → doing → done; doing may go back to todo; done is final. */
export function moveTask(db: DatabaseSync, id: number, to: Status): Task {
  const task = getTask(db, id);
  if (!task) throw new RuleViolation(`task ${id} not found`);
  if (!NEXT[task.status].includes(to)) throw new RuleViolation(`cannot move a ${task.status} task to ${to}`);
  db.prepare("update tasks set status = ? where id = ?").run(to, id);
  return getTask(db, id)!;
}

function toTask(row: Record<string, unknown>): Task {
  return {
    id: Number(row.id),
    title: String(row.title),
    status: row.status as Status,
    assignee: (row.assignee as string | null) ?? null,
    estimateHours: row.estimate_hours == null ? null : Number(row.estimate_hours),
    createdAt: String(row.created_at),
  };
}
