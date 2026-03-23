import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { completeTask, getTask, getTaskHistory, reportTaskProblem } from "../api/tasks";
import Layout from "../components/Layout";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  const loadTask = async () => {
    const [taskRes, historyRes] = await Promise.all([
      getTask(id),
      getTaskHistory(id),
    ]);
    setTask(taskRes.data);
    setHistory(historyRes.data);
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  if (!task) return <Layout><p>Загрузка...</p></Layout>;

  return (
    <Layout>
      <div className="form-card">
        <h1>Карточка задачи</h1>

        <p><strong>ID:</strong> {task.id}</p>
        <p><strong>Статус:</strong> {task.status}</p>
        <p><strong>Дата:</strong> {new Date(task.planned_date).toLocaleString()}</p>
        <p><strong>Комментарий:</strong> {task.comment || "-"}</p>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={async () => {
            await completeTask(id, {
              task_id: id,
              performed_by: task.created_by,
              result_status: "done",
              notes: "Задача выполнена",
            });
            setMessage("Задача отмечена как выполненная");
            loadTask();
          }}>
            Отметить выполнено
          </button>

          <button onClick={async () => {
            await reportTaskProblem(id, {
              task_id: id,
              performed_by: task.created_by,
              result_status: "problem",
              notes: "Зафиксирована проблема",
            });
            setMessage("Проблема зафиксирована");
            loadTask();
          }}>
            Сообщить о проблеме
          </button>
        </div>

        {message && <p>{message}</p>}

        <h2>История выполнения</h2>
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              {item.result_status} — {item.notes || "-"}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
