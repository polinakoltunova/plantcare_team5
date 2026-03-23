import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlant } from "../api/plants";
import { getObservations } from "../api/observations";
import ObservationsList from "../components/ObservationList";
import Layout from "../components/Layout";

export default function PlantDetailsPage() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [observations, setObservations] = useState([]);

  useEffect(() => {
    async function load() {
      const [plantRes, obsRes] = await Promise.all([
        getPlant(id),
        getObservations(id, null, null),
      ]);
      setPlant(plantRes.data);
      setObservations(obsRes.data);
    }
    load();
  }, [id]);

  if (!plant) return <Layout><p>Загрузка...</p></Layout>;

  return (
    <Layout>
      <div className="form-card">
        <h1>Карточка растения</h1>

        <p><strong>ID:</strong> {plant.id}</p>
        <p><strong>Инвентарный номер:</strong> {plant.inventory_number}</p>
        <p><strong>Статус:</strong> {plant.status}</p>
        <p><strong>Страна:</strong> {plant.origin_country || "-"}</p>
        <p><strong>Дата высадки:</strong> {plant.planting_date || "-"}</p>
        <p><strong>Возраст:</strong> {plant.estimated_age_years ?? "-"}</p>
        <p><strong>Примечание:</strong> {plant.notes || "-"}</p>

        <h2>Наблюдения</h2>
        <ObservationsList observations={observations} />
      </div>
    </Layout>
  );
}
