function ClimateTable({ items }) {
  if (!items.length) {
    return <p>Измерения отсутствуют.</p>;
  }
  return (
    <table border="1" cellPadding="8" cellSpacing="0" width="100%">
      <thead>
        <tr>
          <th>Температура</th>
          <th>Влажность</th>
          <th>Время измерения</th>
        </tr>
      </thead>
      <tbody>
        {items.map((row) => (
          <tr key={row.id}>
            <td>{row.temperature}</td>
            <td>{row.humidity}</td>
            <td>{new Date(row.measured_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default ClimateTable;
