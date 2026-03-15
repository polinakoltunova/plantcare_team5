function ObservationList({ observations }) {
  if (!observations.length) {
    return <p>Наблюдений нет.</p>;
  }
  return (
    <ul>
      {observations.map((item) => (
        <li key={item.id} style={{ marginBottom: "10px" }}>
          <strong>{item.observation_type}</strong>: {item.description}
          {item.health_status ? ` (${item.health_status})` : ""}
        </li>
      ))}
    </ul>
  );
}

export default ObservationList;