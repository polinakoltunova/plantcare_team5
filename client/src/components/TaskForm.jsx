import { useState } from "react";
function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({
    plant_id: "",
    zone_id: "",
    operation_id: "",
    assigned_user_id: "",
    planned_date: "",
    created_by: "",
    comment: "",
  });
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      plant_id: form.plant_id || null,
      zone_id: form.zone_id || null,
      assigned_user_id: form.assigned_user_id || null,
    });
  };
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "500px" }}>
      <input name="plant_id" placeholder="plant_id" value={form.plant_id} onChange={handleChange} />
      <input name="zone_id" placeholder="zone_id" value={form.zone_id} onChange={handleChange} />
      <input name="operation_id" placeholder="operation_id" value={form.operation_id} onChange={handleChange} required />
      <input name="assigned_user_id" placeholder="assigned_user_id" value={form.assigned_user_id} onChange={handleChange} />
      <input name="planned_date" type="datetime-local" value={form.planned_date} onChange={handleChange} required />
      <input name="created_by" placeholder="created_by" value={form.created_by} onChange={handleChange} required />
      <textarea name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange} />
      <button type="submit">Создать задачу</button>
    </form>
  );
}
export default TaskForm;
