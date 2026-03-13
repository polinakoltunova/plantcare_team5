import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTaskById, createTask, updateTask } from "../api/tasks";
import { getPlants } from "../api/plants";
import { getZones } from "../api/zones";
import { getOperations } from "../api/operations"; // если есть
import { getUsers } from "../api/auth"; // если нужно выбирать исполнителя

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plants, setPlants] = useState([]);
  const [zones, setZones] = useState([]);
  const [operations, setOperations] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    plant_id: "",
    zone_id: "",
    operation_id: "",
    assigned_user_id: "",
    planned_date: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);

  // Загружаем справочники
  useEffect(() => {
    async function loadData() {
      const [plantsData, zonesData, opsData, usersData] = await Promise.all([
        getPlants(),
        getZones(),
        getOperations(),
        getUsers(),
      ]);

      setPlants(plantsData);
      setZones(zonesData);
      setOperations(opsData);
      setUsers(usersData);
    }
    loadData();
  }, []);

  // Если редактирование — загружаем задачу
  useEffect(() => {
    if (!id) return;

    async function loadTask() {
      const task = await getTaskById(id);
      setForm({
        plant_id: task.plant_id || "",
        zone_id: task.zone_id || "",
        operation_id: task.operation_id,
        assigned_user_id: task.assigned_user_id || "",
        planned_date: task.planned_date.slice(0, 16), // YYYY-MM-DDTHH:mm
        comment: task.comment || "",
      });
    }

    loadTask();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateTask(id, form);
      } else {
        await createTask(form);
      }
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>{id ? "Редактировать задачу" : "Создать задачу"}</h2>

      <form onSubmit={handleSubmit}>

        <label>
          Растение (необязательно):
          <select name="plant_id" value={form.plant_id} onChange={handleChange}>
            <option value="">—</option>
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.common_name || p.scientific_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Зона (если задача для зоны):
          <select name="zone_id" value={form.zone_id} onChange={handleChange}>
            <option value="">—</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Операция ухода:
          <select
            name="operation_id"
            value={form.operation_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите операцию</option>
            {operations.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Исполнитель:
          <select
            name="assigned_user_id"
            value={form.assigned_user_id}
            onChange={handleChange}
          >
            <option value="">—</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Дата и время:
          <input
            type="datetime-local"
            name="planned_date"
            value={form.planned_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Комментарий:
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
