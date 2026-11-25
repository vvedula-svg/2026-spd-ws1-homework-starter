import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { listTasks } from "@/lib/tasks";
import { POST } from "./route";

// The real route and migrations run against a private in-memory database in this test worker.
process.env.DB_FILE = ":memory:";
beforeEach(() => db().exec("delete from tasks"));
afterAll(() => db().close());

function post(input: Record<string, unknown>) {
  return POST(new Request("http://localhost/api/tasks", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
  }));
}

describe("POST /api/tasks estimates", () => {
  it.each([1, 40])("returns 201 and persists estimate %s", async (estimateHours) => {
    const response = await post({ title: "Plan work", estimateHours });
    expect(response.status).toBe(201);
    const task = await response.json();
    expect(task.estimateHours).toBe(estimateHours);
    expect(listTasks(db())).toEqual([task]);
  });

  it.each([0, 41, 1.5, "3", "abc", null, true, false, [], {}].map(estimateHours => ({ estimateHours })))(
    "returns 422 for $estimateHours without storing a task", async ({ estimateHours }) => {
      const response = await post({ title: "Plan work", estimateHours });
      expect(response.status).toBe(422);
      expect(await response.json()).toEqual({ error: "estimateHours must be a whole number 1..40" });
      expect(listTasks(db())).toEqual([]);
    },
  );

  it("returns 201 and null when estimateHours is omitted", async () => {
    const response = await post({ title: "Unestimated work" });
    expect(response.status).toBe(201);
    const task = await response.json();
    expect(task.estimateHours).toBeNull();
    expect(listTasks(db())).toEqual([task]);
  });
});
