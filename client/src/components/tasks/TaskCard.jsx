export default function TaskCard({ task, onClick }) {
  if (!task) return null;

  return (
    <div
      className="task-card"
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>
        {task.operation_name}
      </h3>

      {task.plant_name && (
        <p style={{ margin: "4px 0" }}>
          <strong>Растение:</strong> {task.plant_name}
        </p>
      )}

      {task.zone_name && (
        <p style={{ margin: "4px 0" }}>
          <strong>Зона:</strong> {task.zone_name}
        </p>
      )}

      <p style={{ margin: "4px 0" }}>
        <strong>Дата:</strong> {new Date(task.planned_date).toLocaleString()}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Статус:</strong> {task.status}
      </p>

      {task.assigned_user && (
        <p style={{ margin: "4px 0" }}>
          <strong>Исполнитель:</strong> {task.assigned_user}
        </p>
      )}
    </div>
  );
}
