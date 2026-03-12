import { Link } from "react-router-dom";
function Navbar() {
  const navStyle = {
    display: "flex",
    gap: "16px",
    padding: "16px 20px",
    borderBottom: "1px solid #ddd",
    marginBottom: "20px",
  };
  return (
    <nav style={navStyle}>
      <Link to="/">Главная</Link>
      <Link to="/login">Вход</Link>
      <Link to="/plants">Растения</Link>
      <Link to="/tasks">Задачи</Link>
      <Link to="/observations">Наблюдения</Link>
      <Link to="/climate">Климат</Link>
      <Link to="/zones">Зоны</Link>
    </nav>
  );
}
export default Navbar;
