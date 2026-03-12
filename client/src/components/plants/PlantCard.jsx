export default function PlantCard({ plant, onClick }) {
  if (!plant) return null;

  return (
    <div 
      className="plant-card"
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "12px",
        cursor: "pointer",
        background: "#fff",
        transition: "0.2s",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>
        {plant.common_name || plant.scientific_name}
      </h3>

      <p style={{ margin: "4px 0" }}>
        <strong>Инвентарный номер:</strong> {plant.inventory_number}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Зона:</strong> {plant.zone_name}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Статус:</strong> {plant.status}
      </p>
    </div>
  );
}
