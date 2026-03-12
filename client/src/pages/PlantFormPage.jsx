import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlantById, createPlant, updatePlant } from "../api/plants";
import { getSpecies } from "../api/species";
import { getZones } from "../api/zones";

export default function PlantFormPage() {
  const { id } = useParams(); // если есть id → редактирование
  const navigate = useNavigate();

  const [speciesList, setSpeciesList] = useState([]);
  const [zonesList, setZonesList] = useState([]);

  const [form, setForm] = useState({
    species_id: "",
    zone_id: "",
    inventory_number: "",
    origin_country: "",
    planting_date: "",
    estimated_age_years: "",
    status: "healthy",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  // Загружаем справочники
  useEffect(() => {
    async function loadData() {
      const [species, zones] = await Promise.all([
        getSpecies(),
        getZones(),
      ]);
      setSpeciesList(species);
      setZonesList(zones);
    }
    loadData();
  }, []);

  // Если редактирование — загружаем растение
  useEffect(() => {
    if (!id) return;

    async function loadPlant() {
      const plant = await getPlantById(id);
      setForm({
        species_id: plant.species_id,
        zone_id: plant.zone_id,
        inventory_number: plant.inventory_number,
        origin_country: plant.origin_country || "",
        planting_date: plant.planting_date || "",
        estimated_age_years: plant.estimated_age_years || "",
        status: plant.status,
        notes: plant.notes || "",
      });
    }

    loadPlant();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updatePlant(id, form);
      } else {
        await createPlant(form);
      }
      navigate("/plants");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>{id ? "Редактировать растение" : "Добавить растение"}</h2>

      <form onSubmit={handleSubmit}>

        <label>
          Вид растения:
          <select
            name="species_id"
            value={form.species_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите вид</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.common_name || s.scientific_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Зона:
          <select
            name="zone_id"
            value={form.zone_id}
            onChange={handleChange}
            required
          >
            <option value="">Выберите зону</option>
            {zonesList.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Инвентарный номер:
          <input
            name="inventory_number"
            value={form.inventory_number}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Страна происхождения:
          <input
            name="origin_country"
            value={form.origin_country}
            onChange={handleChange}
          />
        </label>

        <label>
          Дата посадки:
          <input
            type="date"
            name="planting_date"
            value={form.planting_date}
            onChange={handleChange}
          />
        </label>

        <label>
          Примерный возраст (лет):
          <input
            type="number"
            name="estimated_age_years"
            value={form.estimated_age_years}
            onChange={handleChange}
          />
        </label>

        <label>
          Статус:
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="healthy">healthy</option>
            <option value="warning">warning</option>
            <option value="critical">critical</option>
            <option value="archived">archived</option>
          </select>
        </label>

        <label>
          Примечания:
          <textarea
            name="notes"
            value={form.notes}
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
