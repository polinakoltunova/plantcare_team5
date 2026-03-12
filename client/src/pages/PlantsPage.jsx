import { useEffect, useState } from "react";
import { createPlant, getPlants } from "../api/plants";
import PlantTable from "../components/PlantTable";
import PlantForm from "../components/PlantForm";
function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const loadPlants = async () => {
    const response = await getPlants(null, search || undefined);
    setPlants(response.data);
  };
  useEffect(() => {
    loadPlants();
  }, []);
  const handleCreate = async (data) => {
    await createPlant(data);
    await loadPlants();
  };
  return (
    <div>
      <h1>Растения</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Поиск по инвентарному номеру"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={loadPlants}>Найти</button>
      </div>
      <PlantTable plants={plants} />
      <h2 style={{ marginTop: "30px" }}>Добавить растение</h2>
      <PlantForm onSubmit={handleCreate} />
    </div>
  );
}
export default PlantsPage;
