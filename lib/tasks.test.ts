import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { openDb } from "./db";
import { createTask, listTasks, moveTask, RuleViolation } from "./tasks";
import type { DatabaseSync } from "node:sqlite";

let db: DatabaseSync;
beforeEach(() => {
  db = openDb(":memory:");
});
afterEach(() => db.close());

describe("tasks", () => {
  it.each([1, 40])("accepts an estimate of %s whole hours", (estimateHours) => {
    const task = createTask(db, { title: "Plan work", estimateHours });
    expect(task.estimateHours).toBe(estimateHours);
    expect(listTasks(db)).toEqual([task]);
  });

  it.each([0, 41, 1.5, "3", "abc", null, true, false, [], {}, NaN, Infinity, -Infinity]
    .map(estimateHours => ({ estimateHours })))(
    "rejects estimate $estimateHours without storing a task", ({ estimateHours }) => {
      // The API accepts untyped JSON; exercise those runtime inputs at this boundary.
      expect(() => createTask(db, { title: "Plan work", estimateHours: estimateHours as number }))
        .toThrow(new RuleViolation("estimateHours must be a whole number 1..40"));
      expect(listTasks(db)).toEqual([]);
    },
  );

  it("creates a task without an estimate as null", () => {
    const task = createTask(db, { title: "Unestimated work" });
    expect(task.estimateHours).toBeNull();
    expect(listTasks(db)).toEqual([task]);
  });

  it("creates a task in todo", () => {
    const t = createTask(db, { title: "Write the team agreement", estimateHours: 2 });
    expect(t.status).toBe("todo");
    expect(listTasks(db)).toHaveLength(1);
  });

  it("rejects an empty title", () => {
    expect(() => createTask(db, { title: "  " })).toThrow(RuleViolation);
  });

  it("follows todo → doing → done and keeps done final", () => {
    const t = createTask(db, { title: "Add a hook" });
    moveTask(db, t.id, "doing");
    moveTask(db, t.id, "done");
    expect(() => moveTask(db, t.id, "todo")).toThrow(RuleViolation);
  });

  it("does not skip doing", () => {
    const t = createTask(db, { title: "Path rule" });
    expect(() => moveTask(db, t.id, "done")).toThrow(RuleViolation);
  });
});
