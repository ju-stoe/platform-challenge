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

test("POST /tasks creates a new task", async (t) => {
  const server = app.listen(0);

  t.after(() => {
    server.close();
  });

  const port = server.address().port;

  const response = await fetch(`http://127.0.0.1:${port}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Create POST endpoint"
    })
  });

  assert.equal(response.status, 201);

  const task = await response.json();

  assert.ok("id" in task);
  assert.equal(task.title, "Create POST endpoint");
  assert.equal(task.completed, false);
});

test("POST /tasks returns 400 for an empty title", async (t) => {
  const server = app.listen(0);

  t.after(() => {
    server.close();
  });

  const port = server.address().port;

  const response = await fetch(`http://127.0.0.1:${port}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: ""
    })
  });

  assert.equal(response.status, 400);
});

test("PATCH /tasks/:id updates the completed status", async (t) => {
  const server = app.listen(0);
 
  t.after(() => {
    server.close();
  });
 
  const port = server.address().port;
 
  const response = await fetch(`http://127.0.0.1:${port}/tasks/1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });
 
  assert.equal(response.status, 200);
 
  const task = await response.json();
 
  assert.equal(task.id, 1);
  assert.equal(task.completed, true);
});
 
test("PATCH /tasks/:id returns 404 for an unknown task", async (t) => {
  const server = app.listen(0);
 
  t.after(() => {
    server.close();
  });
 
  const port = server.address().port;
 
  const response = await fetch(`http://127.0.0.1:${port}/tasks/999`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });
 
  assert.equal(response.status, 404);
});
 
test("PATCH /tasks/:id returns 400 for invalid input", async (t) => {
  const server = app.listen(0);
 
  t.after(() => {
    server.close();
  });
 
  const port = server.address().port;
 
  const response = await fetch(`http://127.0.0.1:${port}/tasks/1`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: "yes"
    })
  });
 
  assert.equal(response.status, 400);
});