import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PlantsPage from "./pages/PlantsPage";
import PlantDetailsPage from "./pages/PlantDetailsPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import ObservationsPage from "./pages/ObservationsPage";
import ClimatePage from "./pages/ClimatePage";
import ZonesPage from "./pages/ZonesPage";
function App() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="/plants/:id" element={<PlantDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/observations" element={<ObservationsPage />} />
          <Route path="/climate" element={<ClimatePage />} />
          <Route path="/zones" element={<ZonesPage />} />
        </Routes>
      </div>
    </>
  );
}
export default App;
