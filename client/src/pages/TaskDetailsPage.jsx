import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { completeTask, getTask, getTaskHistory, reportTaskProblem } from "../api/tasks";
function TaskDetailsPage() {
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
  const handleComplete = async () => {
    await completeTask(id, {
      task_id: id,
      performed_by: task.created_by,
      result_status: "done",
      notes: "Задача выполнена",
    });
    setMessage("Задача отмечена как выполненная");
    await loadTask();
  };
  const handleProblem = async () => {
    await reportTaskProblem(id, {
      task_id: id,
      performed_by: task.created_by,
      result_status: "problem",
      notes: "Зафиксирована проблема",
    });
    setMessage("Проблема зафиксирована");
    await loadTask();
  };
  if (!task) {
    return <p>Загрузка...</p>;
  }
  return (
    <div>
      <h1>Карточка задачи</h1>
      <p><strong>ID:</strong> {task.id}</p>
      <p><strong>Статус:</strong> {task.status}</p>
      <p><strong>Дата:</strong> {new Date(task.planned_date).toLocaleString()}</p>
      <p><strong>Комментарий:</strong> {task.comment || "-"}</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button onClick={handleComplete}>Отметить выполнено</button>
        <button onClick={handleProblem}>Сообщить о проблеме</button>
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
  );
}
export default TaskDetailsPage;
