import { useEffect, useState } from "react";
import { getZones } from "../api/zones";
function ZonesPage() {
  const [zones, setZones] = useState([]);
  useEffect(() => {
    const load = async () => {
      const response = await getZones();
      setZones(response.data);
    };
    load();
  }, []);
  return (
    <div>
      <h1>Зоны</h1>
      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Оранжерея</th>
            <th>Описание</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((zone) => (
            <tr key={zone.id}>
              <td>{zone.id}</td>
              <td>{zone.name}</td>
              <td>{zone.greenhouse_id}</td>
              <td>{zone.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ZonesPage;
