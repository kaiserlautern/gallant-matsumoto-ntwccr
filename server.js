const express = require("express");
const cors = require("cors");
const app = express();

// Middleware para processar JSON
app.use(cors());
app.use(express.json());

// "Banco de dados" em memória (substitua por MongoDB/PostgreSQL depois)
let tasks = [
  { id: 1, title: "Estudar React", completed: false },
  { id: 2, title: "Fazer deploy da API", completed: true },
];

// GET todas as tarefas
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET tarefa por ID
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// POST criar nova tarefa
app.post("/api/tasks", (req, res) => {
  const { title, completed = false } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title: title.trim(),
    completed: completed,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT atualizar tarefa
app.put("/api/tasks/:id", (req, res) => {
  const { title, completed } = req.body;
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
    updatedAt: new Date().toISOString(),
  };

  res.json(tasks[taskIndex]);
});

// DELETE remover tarefa
app.delete("/api/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json(deletedTask[0]);
});

// Rota para verificar se a API está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "Tasks API is running",
    endpoints: {
      getTasks: "GET /api/tasks",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id",
    },
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Tasks API running on port ${PORT}`);
});
