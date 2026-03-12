import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlant } from "../api/plants";
import { getObservations } from "../api/observations";
import ObservationList from "../components/ObservationList";
function PlantDetailsPage() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [observations, setObservations] = useState([]);
  useEffect(() => {
    const load = async () => {
      const [plantRes, obsRes] = await Promise.all([
        getPlant(id),
        getObservations(id, null, null),
      ]);
      setPlant(plantRes.data);
      setObservations(obsRes.data);
    };
    load();
  }, [id]);
  if (!plant) {
    return <p>Загрузка...</p>;
  }
  return (
    <div>
      <h1>Карточка растения</h1>
      <p><strong>ID:</strong> {plant.id}</p>
      <p><strong>Инвентарный номер:</strong> {plant.inventory_number}</p>
      <p><strong>Статус:</strong> {plant.status}</p>
      <p><strong>Страна:</strong> {plant.origin_country || "-"}</p>
      <p><strong>Дата высадки:</strong> {plant.planting_date || "-"}</p>
      <p><strong>Возраст:</strong> {plant.estimated_age_years ?? "-"}</p>
      <p><strong>Примечание:</strong> {plant.notes || "-"}</p>
      <h2>Наблюдения</h2>
      <ObservationList observations={observations} />
    </div>
  );
}
export default PlantDetailsPage;