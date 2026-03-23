import { useEffect, useState } from "react";
import { createClimateMeasurement, getClimateMeasurements } from "../api/climate";
import { getZones } from "../api/zones";
import ClimateTable from "../components/ClimateTable";
import Layout from "../components/Layout";

export default function ClimatePage() {
  const [items, setItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ zone_id: "", temperature: "", humidity: "" });

  useEffect(() => {
    async function loadAll() {
      try {
        const [climateRes, zonesRes] = await Promise.all([
          getClimateMeasurements(),
          getZones(),
        ]);
        setItems(climateRes.data);
        setZones(zonesRes.data);
      } catch {
        setError("Не удалось загрузить климатические данные");
      }
    }
    loadAll();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createClimateMeasurement({
        zone_id: form.zone_id,
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
      });
      setForm({ zone_id: "", temperature: "", humidity: "" });
      const updated = await getClimateMeasurements();
      setItems(updated.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Ошибка сохранения");
    }
  };

  return (
    <Layout>
      <h1>Климатические измерения</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ClimateTable items={items} />

      <div className="form-card" style={{ marginTop: 30 }}>
        <h2>Добавить измерение</h2>

        <form className="form-grid" onSubmit={submit}>
          <select name="zone_id" value={form.zone_id} onChange={handleChange} required>
            <option value="">Выберите зону</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          <input name="temperature" type="number" step="0.1" placeholder="Температура" value={form.temperature} onChange={handleChange} required />
          <input name="humidity" type="number" step="0.1" placeholder="Влажность" value={form.humidity} onChange={handleChange} required />

          <button type="submit">Сохранить</button>
        </form>
      </div>
    </Layout>
  );
}
