const test = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("../src/app");

test("GET /tasks returns a JSON array of tasks", async (t) => {
  const server = app.listen(0);

  t.after(() => {
    server.close();
  });

  const port = server.address().port;

  const response = await fetch(`http://127.0.0.1:${port}/tasks`);

  assert.equal(response.status, 200);

  const tasks = await response.json();

  assert.ok(Array.isArray(tasks));

  for (const task of tasks) {
    assert.ok("id" in task);
    assert.ok("title" in task);
    assert.ok("completed" in task);
  }
});