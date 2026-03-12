import { Link } from "react-router-dom";
function PlantTable({ plants }) {
  if (!plants.length) {
    return <p>Растения не найдены.</p>;
  }
  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Инвентарный номер</th>
          <th>Статус</th>
          <th>Страна происхождения</th>
          <th>Возраст</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {plants.map((plant) => (
          <tr key={plant.id}>
            <td>{plant.inventory_number}</td>
            <td>{plant.status}</td>
            <td>{plant.origin_country || "-"}</td>
            <td>{plant.estimated_age_years ?? "-"}</td>
            <td>
              <Link to={`/plants/${plant.id}`}>Открыть</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default PlantTable;
