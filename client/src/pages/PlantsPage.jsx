import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlants } from "../api/plants";
import PlantTable from "../components/plants/PlantTable";
import Layout from "../components/Layout";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");

  const loadPlants = async () => {
    const response = await getPlants(null, search || undefined);
    setPlants(response.data);
  };

  useEffect(() => {
    loadPlants();
  }, []);

  return (
    <Layout>
      <div className="page-header" style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1>Растения</h1>

        {/* КНОПКА ДОБАВЛЕНИЯ */}
        <Link 
          to="/plants/new" 
          className="btn-primary"
          style={{
            background: "var(--green-main)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500
          }}
        >
          ➕ Добавить растение
        </Link>
      </div>

      <div className="form-card" style={{ marginBottom: "20px" }}>
        <div className="form-grid">
          <label>
            Поиск по инвентарному номеру
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Например, INV‑001"
            />
          </label>
          <button onClick={loadPlants}>Найти</button>
        </div>
      </div>

      <PlantTable plants={plants} />
    </Layout>
  );
}
