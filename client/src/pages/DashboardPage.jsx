import { useEffect, useState } from "react";
import { getPlants } from "../api/plants";
import { getTasks } from "../api/tasks";
import { getObservations } from "../api/observations";
function DashboardPage() {
  const [plantsCount, setPlantsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [observationsCount, setObservationsCount] = useState(0);
  useEffect(() => {
    const load = async () => {
      const [plantsRes, tasksRes, observationsRes] = await Promise.all([
        getPlants(),
        getTasks(),
        getObservations(),
      ]);
      setPlantsCount(plantsRes.data.length);
      setTasksCount(tasksRes.data.length);
      setObservationsCount(observationsRes.data.length);
    };
    load();
  }, []);
  return (
    <div>
      <h1>Главная</h1>
      <p>Количество растений: {plantsCount}</p>
      <p>Количество задач: {tasksCount}</p>
      <p>Количество наблюдений: {observationsCount}</p>
    </div>
  );
}
export default DashboardPage;
