import { useEffect, useState } from "react";
import { createObservation, getObservations } from "../api/observations";
import { getPlants } from "../api/plants";
import { getTasks } from "../api/tasks";
import ObservationList from "../components/ObservationList";
import Layout from "../components/Layout";

const INITIAL_FORM = {
  plant_id: "",
  task_id: "",
  type: "inspection",            // ← ПРАВИЛЬНОЕ ПОЛЕ
  health_status: "healthy",
  description: "",
  severity: 1,
};

export default function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);

  async function loadAll() {
    try {
      const [obsRes, plantsRes, tasksRes] = await Promise.all([
        getObservations(),
        getPlants(),
        getTasks(),
      ]);

      setObservations(obsRes.data);
      setPlants(plantsRes.data);
      setTasks(tasksRes.data);
    } catch (e) {
      setError("Не удалось загрузить данные");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function extractErrorMessage(e) {
    const detail = e?.response?.data?.detail;

    if (!detail) return "Не удалось создать наблюдение";

    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg).join(", ");
    }

    return "Не удалось создать наблюдение";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await createObservation({
        plant_id: form.plant_id,
        task_id: form.task_id || null,
        type: form.type,                     // ← ПРАВИЛЬНОЕ ПОЛЕ
        description: form.description,
        health_status: form.health_status,
        severity: Number(form.severity),
      });

      setForm(INITIAL_FORM);
      await loadAll();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  }

  return (
    <Layout>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Наблюдения</h1>
      </div>

      {error && (
        <p style={{ color: "crimson", marginBottom: "16px" }}>
          {error}
        </p>
      )}

      <ObservationList observations={observations} />

      <div className="form-card" style={{ marginTop: "30px" }}>
        <h2>Добавить наблюдение</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Растение
            <select
              name="plant_id"
              value={form.plant_id}
              onChange={handleChange}
              required
            >
              <option value="">Выберите растение</option>
              {plants.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.inventory_number} — {item.species_name || item.id}
                </option>
              ))}
            </select>
          </label>

          <label>
            Связанная задача
            <select
              name="task_id"
              value={form.task_id}
              onChange={handleChange}
            >
              <option value="">Без привязки к задаче</option>
              {tasks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} — {item.status || "planned"}
                </option>
              ))}
            </select>
          </label>

          <label>
            Тип наблюдения
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="inspection">inspection</option>
              <option value="problem">problem</option>
              <option value="comment">comment</option>
            </select>
          </label>

          <label>
            Статус здоровья
            <select
              name="health_status"
              value={form.health_status}
              onChange={handleChange}
            >
              <option value="healthy">healthy</option>
              <option value="needs_attention">needs_attention</option>
              <option value="critical">critical</option>
            </select>
          </label>

          <label>
            Серьезность
            <input
              type="number"
              min="1"
              max="5"
              name="severity"
              value={form.severity}
              onChange={handleChange}
            />
          </label>

          <label>
            Описание
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </label>

          <button type="submit" className="btn-primary">
            Сохранить наблюдение
          </button>
        </form>
      </div>
    </Layout>
  );
}
