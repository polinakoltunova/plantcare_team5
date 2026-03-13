import { Link } from "react-router-dom";
function TaskTable({ tasks }) {
  if (!tasks.length) {
    return <p>Задачи не найдены.</p>;
  }
  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Статус</th>
          <th>Дата</th>
          <th>Комментарий</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.status}</td>
            <td>{new Date(task.planned_date).toLocaleString()}</td>
            <td>{task.comment || "-"}</td>
            <td>
              <Link to={`/tasks/${task.id}`}>Открыть</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TaskTable;
