import { useEffect, useState } from "react";
import { createClimateMeasurement, getClimateMeasurements } from "../api/climate";
import ClimateTable from "../components/ClimateTable";
function ClimatePage() {
  const [items, setItems] = useState([]);
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
    loadClimate();
  }, []);
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submit = async (e) => {
    e.preventDefault();
    await createClimateMeasurement({
      zone_id: form.zone_id,
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
    });
    setForm({ zone_id: "", temperature: "", humidity: "" });
    await loadClimate();
  };
  return (
    <div>
      <h1>Климатические измерения</h1>
      <ClimateTable items={items} />
      <h2 style={{ marginTop: "30px" }}>Добавить измерение</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input name="zone_id" placeholder="zone_id" value={form.zone_id} onChange={handleChange} required />
        <input name="temperature" type="number" step="0.1" placeholder="Температура" value={form.temperature} onChange={handleChange} required />
        <input name="humidity" type="number" step="0.1" placeholder="Влажность" value={form.humidity} onChange={handleChange} required />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}
export default ClimatePage;
