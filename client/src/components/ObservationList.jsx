function ObservationList({ observations }) {
  if (!observations.length) {
    return <p>Наблюдений нет.</p>;
  }
  return (
    <ul>
      {observations.map((item) => (
        <li key={item.id} style={{ marginBottom: "10px" }}>
          <strong>{item.type}</strong>: {item.description}
        </li>
      ))}
    </ul>
  );
}
export default ObservationList;
