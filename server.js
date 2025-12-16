// Desenvolve normalmente no CodeSandbox
// server.js

const express = require("express");
const app = express();

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
