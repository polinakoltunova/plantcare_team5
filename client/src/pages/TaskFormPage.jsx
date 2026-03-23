import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTask, createTask, updateTask } from "../api/tasks";
import { getPlants } from "../api/plants";
import { getCareOperations } from "../api/careOperations";
import { getUsers } from "../api/auth";

import Layout from "../components/Layout";

const INITIAL_FORM = {
  plant_id: "",
  operation_id: "",
  assigned_user_id: "",
  planned_date: "",
  due_date: "",
  comment: "",
};

function toDateTimeLocalValue(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [operations, setOperations] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadReferenceData() {
      const [plantsRes, operationsRes, usersRes] = await Promise.allSettled([
        getPlants(),
        getCareOperations(),
        getUsers(),
      ]);

      setPlants(plantsRes.status === "fulfilled" ? plantsRes.value.data : []);
      setOperations(operationsRes.status === "fulfilled" ? operationsRes.value.data : []);
      setUsers(usersRes.status === "fulfilled" ? usersRes.value.data : []);
    }

    loadReferenceData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      plant_id: form.plant_id || null,
      operation_id: form.operation_id,
      assigned_user_id: form.assigned_user_id || null,
      planned_date: new Date(form.planned_date).toISOString(),
      due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      comment: form.comment || null,
    };

    try {
      if (id) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }
      navigate("/tasks");
    } catch (e) {
      setError(e?.response?.data?.detail || "Не удалось сохранить задачу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="form-card">
        <h1>{id ? "Редактировать задачу" : "Создать задачу"}</h1>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Растение
            <select name="plant_id" value={form.plant_id} onChange={handleChange}>
              <option value="">Без привязки к растению</option>
              {plants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.inventory_number} — {item.species_name || item.origin_country || item.id}
                </option>
              ))}
            </select>
          </label>

          <label>
            Операция ухода
            <select name="operation_id" value={form.operation_id} onChange={handleChange} required>
              <option value="">Выберите операцию</option>
              {operations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Исполнитель
            <select name="assigned_user_id" value={form.assigned_user_id} onChange={handleChange}>
              <option value="">Не назначен</option>
              {users?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.first_name || item.username} {item.last_name || ""}
                </option>
              ))}
            </select>
          </label>

          <label>
            Плановая дата
            <input type="datetime-local" name="planned_date" value={form.planned_date} onChange={handleChange} required />
          </label>

          <label>
            Срок выполнения
            <input type="datetime-local" name="due_date" value={form.due_date} onChange={handleChange} />
          </label>

          <label>
            Комментарий
            <textarea name="comment" value={form.comment} onChange={handleChange} rows={4} />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить задачу"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
