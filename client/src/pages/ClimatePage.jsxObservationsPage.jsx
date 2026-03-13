import { useEffect, useState } from "react";
import { createObservation, getObservations } from "../api/observations";
import ObservationList from "../components/ObservationList";
function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [form, setForm] = useState({
    plant_id: "",
    zone_id: "",
    task_id: "",
    created_by: "",
    type: "",
    description: "",
  });
  const loadObservations = async () => {
    const response = await getObservations();
    setObservations(response.data);
  };
  useEffect(() => {
    loadObservations();
  }, []);
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submit = async (e) => {
    e.preventDefault();
    await createObservation({
      plant_id: form.plant_id || null,
      zone_id: form.zone_id || null,
      task_id: form.task_id || null,
      created_by: form.created_by,
      type: form.type,
      description: form.description,
    });
    setForm({
      plant_id: "",
      zone_id: "",
      task_id: "",
      created_by: "",
      type: "",
      description: "",
    });
    await loadObservations();
  };
  return (
    <div>
      <h1>Наблюдения</h1>
      <ObservationList observations={observations} />
      <h2 style={{ marginTop: "30px" }}>Добавить наблюдение</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "500px" }}>
        <input name="plant_id" placeholder="plant_id" value={form.plant_id} onChange={handleChange} />
        <input name="zone_id" placeholder="zone_id" value={form.zone_id} onChange={handleChange} />
        <input name="task_id" placeholder="task_id" value={form.task_id} onChange={handleChange} />
        <input name="created_by" placeholder="created_by" value={form.created_by} onChange={handleChange} required />
        <input name="type" placeholder="Тип наблюдения" value={form.type} onChange={handleChange} required />
        <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} required />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}
export default ObservationsPage;
