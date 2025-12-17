// Desenvolve normalmente no CodeSandbox
// server.js

const express = require("express");
const app = express();

// Middleware para CORS (coloque ANTES das rotas)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // ⬅️ Permite qualquer origem
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.get("/api/users", (req, res) => {
  // Por enquanto mockado
  res.json([
    { id: 1, name: "João" },
    { id: 2, name: "Maria" },
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
