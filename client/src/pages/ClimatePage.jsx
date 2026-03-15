import { useEffect, useState } from "react";
import { createClimateMeasurement, getClimateMeasurements } from "../api/climate";
import { getZones } from "../api/zones";
import ClimateTable from "../components/ClimateTable";

function ClimatePage() {
  const [items, setItems] = useState([]);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    zone_id: "",
    temperature: "",
    humidity: "",
  });

  const loadClimate = async () => {
    const response = await getClimateMeasurements();
    setItems(response.data);
  };

  useEffect(() => {
    async function loadAll() {
      try {
        const [climateRes, zonesRes] = await Promise.all([getClimateMeasurements(), getZones()]);
        setItems(climateRes.data);
        setZones(zonesRes.data);
      } catch (e) {
        setError("Не удалось загрузить климатические измерения или зоны");
      }
    }
    loadAll();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createClimateMeasurement({
        zone_id: form.zone_id,
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
      });
      setForm({ zone_id: "", temperature: "", humidity: "" });
      await loadClimate();
    } catch (err) {
      setError(err?.response?.data?.detail || "Не удалось добавить измерение");
    }
  };

  return (
    <div>
      <h1>Климатические измерения</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ClimateTable items={items} />
      <h2 style={{ marginTop: "30px" }}>Добавить измерение</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <select name="zone_id" value={form.zone_id} onChange={handleChange} required>
          <option value="">Выберите зону</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
        <input name="temperature" type="number" step="0.1" placeholder="Температура" value={form.temperature} onChange={handleChange} required />
        <input name="humidity" type="number" step="0.1" placeholder="Влажность" value={form.humidity} onChange={handleChange} required />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default ClimatePage;