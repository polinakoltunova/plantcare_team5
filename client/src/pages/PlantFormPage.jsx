import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPlant } from "../api/plants";
import { getSpecies } from "../api/species";
import { getZones } from "../api/zones";

const INITIAL_FORM = {
  species_id: "",
  zone_id: "",
  inventory_number: "",
  planting_date: "",
  status: "healthy",
  notes: "",
};

export default function PlantFormPage() {
  const navigate = useNavigate();
  const [species, setSpecies] = useState([]);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    async function loadReferenceData() {
      try {
        const [speciesRes, zonesRes] = await Promise.all([getSpecies(), getZones()]);
        setSpecies(speciesRes.data);
        setZones(zonesRes.data);
      } catch (e) {
        setError("Не удалось загрузить справочники");
      }
    }
    loadReferenceData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createPlant({
        species_id: form.species_id,
        zone_id: form.zone_id,
        inventory_number: form.inventory_number.trim(),
        planting_date: form.planting_date || null,
        status: form.status,
        notes: form.notes || null,
      });
      navigate("/plants");
    } catch (e) {
      setError(e?.response?.data?.detail || "Не удалось создать растение");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1>Добавить растение</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Вид растения
          <select name="species_id" value={form.species_id} onChange={handleChange} required>
            <option value="">Выберите вид</option>
            {species.map((item) => (
              <option key={item.id} value={item.id}>
                {item.common_name || item.scientific_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Зона
          <select name="zone_id" value={form.zone_id} onChange={handleChange} required>
            <option value="">Выберите зону</option>
            {zones.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Инвентарный номер
          <input
            name="inventory_number"
            value={form.inventory_number}
            onChange={handleChange}
            placeholder="Например, INV-001"
            required
          />
        </label>

        <label>
          Дата высадки
          <input type="date" name="planting_date" value={form.planting_date} onChange={handleChange} />
        </label>

        <label>
          Статус
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="healthy">healthy</option>
            <option value="needs_attention">needs_attention</option>
            <option value="critical">critical</option>
          </select>
        </label>

        <label>
          Примечание
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить растение"}
        </button>
      </form>
    </div>
  );
}