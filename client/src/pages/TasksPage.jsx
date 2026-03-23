import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../api/tasks";
import TaskTable from "../components/tasks/TaskTable";
import Layout from "../components/Layout";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await getTasks(status || undefined, undefined);
      setTasks(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <Layout>
      {/* Заголовок + кнопка */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Задачи</h1>

        {/* КНОПКА ДОБАВЛЕНИЯ */}
        <Link
          to="/tasks/new"
          className="btn-primary"
          style={{
            background: "var(--green-main)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ➕ Добавить задачу
        </Link>
      </div>

      <div className="form-card" style={{ marginBottom: "20px" }}>
        <div className="form-grid">
          <label>
            Фильтр по статусу
            <input
              placeholder="Например: pending / done / problem"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </label>

          <button onClick={loadTasks} disabled={loading}>
            {loading ? "Загрузка..." : "Применить"}
          </button>
        </div>
      </div>

      <TaskTable tasks={tasks} />
    </Layout>
  );
}
