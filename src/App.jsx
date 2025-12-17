import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL da sua API (ajuste conforme necessário)
  const API_URL = "https://gallant-matsumoto-ntwccr.onrender.com/api";

  // Buscar tarefas da API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar tarefas ao montar o componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // Criar nova tarefa
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask,
          completed: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTask("");
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error creating task:", err);
    }
  };

  // Alternar status de conclusão
  const handleToggleComplete = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating task:", err);
    }
  };

  // Deletar tarefa
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Gerenciador de Tarefas</h1>
        <p className="app-subtitle">
          Uma aplicação fullstack com React + Node.js
        </p>
      </header>

      <main className="app-main">
        {/* Formulário para adicionar tarefa */}
        <div className="task-form-container">
          <form onSubmit={handleCreateTask} className="task-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Digite uma nova tarefa..."
              className="task-input"
              maxLength="100"
            />
            <button
              type="submit"
              className="add-button"
              disabled={!newTask.trim()}
            >
              ➕ Adicionar
            </button>
          </form>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="error-message">
            ❌ Erro: {error}
            <button onClick={() => setError(null)} className="dismiss-error">
              ✕
            </button>
          </div>
        )}

        {/* Lista de tarefas */}
        <div className="tasks-container">
          {loading ? (
            <div className="loading">Carregando tarefas...</div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks">
              <p>🎉 Nenhuma tarefa encontrada!</p>
              <p>Adicione sua primeira tarefa acima.</p>
            </div>
          ) : (
            <>
              <div className="tasks-header">
                <h2>Suas Tarefas ({tasks.length})</h2>
                <button
                  onClick={fetchTasks}
                  className="refresh-button"
                  title="Recarregar tarefas"
                >
                  🔄
                </button>
              </div>

              <div className="tasks-list">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-item ${task.completed ? "completed" : ""}`}
                  >
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        className="task-checkbox"
                      />
                      <div className="task-details">
                        <span className="task-title">{task.title}</span>
                        {task.createdAt && (
                          <small className="task-date">
                            Criada em:{" "}
                            {new Date(task.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </small>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-button"
                      title="Excluir tarefa"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Estatísticas */}
              <div className="tasks-stats">
                <div className="stat">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{tasks.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Concluídas:</span>
                  <span className="stat-value">
                    {tasks.filter((t) => t.completed).length}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Pendentes:</span>
                  <span className="stat-value">
                    {tasks.filter((t) => !t.completed).length}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          ⚡ Dica: Clique na caixa de seleção para marcar/desmarcar como
          concluída
        </p>
      </footer>
    </div>
  );
}

export default App;
