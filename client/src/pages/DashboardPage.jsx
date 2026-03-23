import { useEffect, useState } from "react";
import { getPlants } from "../api/plants";
import { getTasks } from "../api/tasks";
import { getObservations } from "../api/observations";
import Layout from "../components/Layout";

const styles = {
  title: {
    fontSize: "28px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  subtitle: {
    color: "var(--text-muted)",
    marginBottom: "24px",
  },
  cards: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
  card: {
    flex: "1 1 220px",
    background: "var(--card-bg)",
    borderRadius: "16px",
    padding: "18px 20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  cardLabel: {
    fontSize: "14px",
    color: "var(--text-muted)",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: 600,
  },
};

function DashboardPage() {
  const [plantsCount, setPlantsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [observationsCount, setObservationsCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [plantsRes, tasksRes, observationsRes] = await Promise.allSettled([
        getPlants(),
        getTasks(),
        getObservations(),
      ]);

      if (plantsRes.status === "fulfilled") {
        setPlantsCount(plantsRes.value.data.length);
      }
      if (tasksRes.status === "fulfilled") {
        setTasksCount(tasksRes.value.data.length);
      }
      if (observationsRes.status === "fulfilled") {
        setObservationsCount(observationsRes.value.data.length);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <h1 style={styles.title}>Главная</h1>
      <p style={styles.subtitle}>
        Обзор состояния коллекции ботанического сада.
      </p>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>🌱 Растений</div>
          <div style={styles.cardValue}>{plantsCount}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>📝 Задач по уходу</div>
          <div style={styles.cardValue}>{tasksCount}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>👁️ Наблюдений</div>
          <div style={styles.cardValue}>{observationsCount}</div>
        </div>
      </div>
    </Layout>
  );
}

export default DashboardPage;
