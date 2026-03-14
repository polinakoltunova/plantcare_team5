import { useEffect, useState } from "react";
import { createTask, getTasks } from "../api/tasks";
import TaskTable from "../components/tasks/TaskTable";
import TaskForm from "../components/TaskForm";
function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const loadTasks = async () => {
    const response = await getTasks(status || undefined, undefined);
    setTasks(response.data);
  };
  useEffect(() => {
    loadTasks();
  }, []);
  const handleCreate = async (data) => {
    await createTask(data);
    await loadTasks();
  };
  return (
    <div>
      <h1>Задачи</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Фильтр по статусу"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <button onClick={loadTasks}>Применить</button>
      </div>
      <TaskTable tasks={tasks} />
      <h2 style={{ marginTop: "30px" }}>Создать задачу</h2>
      <TaskForm onSubmit={handleCreate} />
    </div>
  );
}
export default TasksPage;
