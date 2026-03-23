import React from "react";
import { Link } from "react-router-dom";

const layoutStyles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 32px",
    background: "var(--green-main)",
    color: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navLeft: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  navRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    fontSize: "18px",
  },
  navLink: {
    fontSize: "15px",
    opacity: 0.95,
  },
  authLink: {
    fontSize: "15px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.4)",
  },
  main: {
    maxWidth: "1100px",
    width: "100%",
    margin: "24px auto 40px",
    padding: "0 16px",
  },
};

export default function Layout({ children }) {
  return (
    <div style={layoutStyles.page}>
      <nav style={layoutStyles.nav}>
        <div style={layoutStyles.navLeft}>
          <div style={layoutStyles.logo}>
            <span>🌿</span>
            <span>BotanicCare</span>
          </div>
          <Link to="/" style={layoutStyles.navLink}>🏠 Главная</Link>
          <Link to="/plants" style={layoutStyles.navLink}>🌱 Растения</Link>
          <Link to="/tasks" style={layoutStyles.navLink}>📝 Задачи</Link>
          <Link to="/observations" style={layoutStyles.navLink}>👁️ Наблюдения</Link>
          <Link to="/climate" style={layoutStyles.navLink}>🌡️ Климат</Link>
          <Link to="/zones" style={layoutStyles.navLink}>🗺️ Зоны</Link>
        </div>

        <div style={layoutStyles.navRight}>
          <Link to="/register" style={layoutStyles.authLink}>Регистрация</Link>
          <Link to="/login" style={layoutStyles.authLink}>Вход</Link>
        </div>
      </nav>

      <main style={layoutStyles.main}>{children}</main>
    </div>
  );
}
