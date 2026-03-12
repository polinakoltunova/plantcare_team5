import { useState } from "react";
function PlantForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    species_id: initialData.species_id || "",
    zone_id: initialData.zone_id || "",
    inventory_number: initialData.inventory_number || "",
    origin_country: initialData.origin_country || "",
    planting_date: initialData.planting_date || "",
    estimated_age_years: initialData.estimated_age_years || "",
    status: initialData.status || "healthy",
    notes: initialData.notes || "",
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
      estimated_age_years: form.estimated_age_years
        ? Number(form.estimated_age_years)
        : null,
    });
  };
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "500px" }}>
      <input name="species_id" placeholder="species_id" value={form.species_id} onChange={handleChange} required />
      <input name="zone_id" placeholder="zone_id" value={form.zone_id} onChange={handleChange} required />
      <input name="inventory_number" placeholder="Инвентарный номер" value={form.inventory_number} onChange={handleChange} required />
      <input name="origin_country" placeholder="Страна происхождения" value={form.origin_country} onChange={handleChange} />
      <input name="planting_date" type="date" value={form.planting_date} onChange={handleChange} />
      <input name="estimated_age_years" type="number" placeholder="Примерный возраст" value={form.estimated_age_years} onChange={handleChange} />
      <input name="status" placeholder="Статус" value={form.status} onChange={handleChange} />
      <textarea name="notes" placeholder="Примечание" value={form.notes} onChange={handleChange} />
      <button type="submit">Сохранить растение</button>
    </form>
  );
}
export default PlantForm;
