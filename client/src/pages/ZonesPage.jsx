import { useEffect, useState } from "react";
import { getZones } from "../api/zones";
import Layout from "../components/Layout";

export default function ZonesPage() {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getZones();
        setZones(res.data);
      } catch (e) {
        setError("Не удалось загрузить зоны");
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <h1>Зоны</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* Широкий контейнер для таблицы */}
      <div
        style={{
          background: "var(--card-bg)",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflowX: "auto",
          width: "100%",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "1000px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "var(--green-soft)" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Название</th>
              <th style={thStyle}>Оранжерея</th>
              <th style={thStyle}>Описание</th>
            </tr>
          </thead>

          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{zone.id}</td>
                <td style={tdStyle}>{zone.name}</td>
                <td style={tdStyle}>{zone.greenhouse_id || "-"}</td>
                <td style={tdStyle}>{zone.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  fontWeight: 600,
  color: "var(--text-main)",
};

const tdStyle = {
  padding: "10px 10px",
  textAlign: "left",
  color: "var(--text-main)",
};
