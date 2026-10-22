
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: "Learn Node.js", done: true },
  { id: 2, title: "Build a Docker image", done: false },
  { id: 3, title: "Configure GitHub Actions", done: false }
];

let nextId = 4;

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const title = String(req.body.title || "").trim();

  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.done = Boolean(req.body.done);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== Number(req.params.id));

  if (tasks.length === before) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.sendStatus(204);
});

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TaskFlow | Task Manager</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:#f4f6fb;color:#20243a}
header{background:linear-gradient(120deg,#4938c9,#7866f5);color:white;padding:27px 20px}
nav,.container{max-width:850px;margin:auto}
.logo{font-size:25px;font-weight:800;letter-spacing:-1px}
header p{margin:8px 0 0;color:#e6e2ff}
.container{padding:28px 18px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px}
.stat,.panel{background:white;border:1px solid #e8eaf2;border-radius:16px;padding:20px}
.stat span{color:#777e93;font-size:13px}
.stat strong{display:block;font-size:28px;margin-top:8px}
.panel h2{font-size:18px;margin:0 0 16px}
form{display:flex;gap:10px}
input{flex:1;min-width:0;padding:13px 14px;border:1px solid #dfe2ed;border-radius:10px;font-size:15px;outline-color:#6d5ce7}
button{border:0;border-radius:10px;padding:12px 17px;background:#5b4be0;color:white;font-weight:650;cursor:pointer}
button:hover{filter:brightness(.94)}
.filters{display:flex;gap:8px;margin:20px 0}
.filters button{background:#f0efff;color:#5b4be0;padding:9px 13px}
.filters button.active{background:#5b4be0;color:white}
#list{display:grid;gap:10px}
.task{display:flex;align-items:center;gap:12px;border:1px solid #eceef5;padding:14px;border-radius:12px}
.task input{flex:0 0 18px;width:18px;height:18px;accent-color:#5b4be0}
.task-title{flex:1;overflow-wrap:anywhere}
.task.done .task-title{text-decoration:line-through;color:#9297a8}
.delete{background:#fff0f0;color:#c53d4a;padding:9px 12px}
.empty{text-align:center;padding:30px;color:#858ba0}
footer{text-align:center;color:#858ba0;font-size:12px;padding:25px}
@media(max-width:520px){.stats{gap:8px}.stat{padding:13px}.stat strong{font-size:23px}.stat span{font-size:11px}.panel{padding:15px}form{flex-wrap:wrap}form input{flex-basis:100%}form button{width:100%}}
</style>
</head>
<body>
<header>
<nav>
<div class="logo">✦ TaskFlow</div>
<p>Your goals, organized. One task at a time.</p>
</nav>
</header>
<main class="container">
<section class="stats">
<div class="stat"><span>Total tasks</span><strong id="total">0</strong></div>
<div class="stat"><span>Completed</span><strong id="completed">0</strong></div>
<div class="stat"><span>Remaining</span><strong id="remaining">0</strong></div>
</section>
<section class="panel">
<h2>✚ Add a new task</h2>
<form id="taskForm">
<input id="taskInput" placeholder="What do you want to accomplish?" maxlength="200" required>
<button type="submit">+ Add task</button>
</form>
<div class="filters">
<button type="button" class="active" data-filter="all">All tasks</button>
<button type="button" data-filter="active">Pending</button>
<button type="button" data-filter="done">Completed</button>
</div>
<div id="list"><div class="empty">Loading your tasks...</div></div>
</section>
</main>
<footer>TaskFlow · Built with Node.js and Express · CI/CD Demo Project</footer>
<script>
const list = document.getElementById("list");
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
let tasks = [];
let filter = "all";

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("Request failed");
  if (response.status === 204) return null;
  return response.json();
}

function render() {
  document.getElementById("total").textContent = tasks.length;
  document.getElementById("completed").textContent =
    tasks.filter(t => t.done).length;
  document.getElementById("remaining").textContent =
    tasks.filter(t => !t.done).length;

  const visible = tasks.filter(t =>
    filter === "all" ||
    (filter === "active" && !t.done) ||
    (filter === "done" && t.done)
  );

  list.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No tasks here. Add one to get started!";
    list.appendChild(empty);
    return;
  }

  visible.forEach(task => {
    const row = document.createElement("div");
    row.className = "task" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");
    checkbox.addEventListener("change", async () => {
      try {
        await request("/api/tasks/" + task.id, {
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({done: checkbox.checked})
        });
        await loadTasks();
      } catch {
        alert("Could not update task. Please try again.");
      }
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Delete";
    del.addEventListener("click", async () => {
      try {
        await request("/api/tasks/" + task.id, {method: "DELETE"});
        await loadTasks();
      } catch {
        alert("Could not delete task. Please try again.");
      }
    });

    row.append(checkbox, title, del);
    list.appendChild(row);
  });
}

async function loadTasks() {
  tasks = await request("/api/tasks");
  render();
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  try {
    await request("/api/tasks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title})
    });
    input.value = "";
    await loadTasks();
    input.focus();
  } catch {
    alert("Could not add task. Please try again.");
  }
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(b =>
      b.classList.toggle("active", b === button)
    );
    render();
  });
});

loadTasks().catch(() => {
  list.textContent = "Could not load tasks. Refresh the page to retry.";
});
</script>
</body>
</html>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("TaskFlow running on port " + PORT);
});
