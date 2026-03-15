import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PlantsPage from "../pages/PlantsPage";
import PlantFormPage from "../pages/PlantFormPage";
import PlantDetailsPage from "../pages/PlantDetailsPage";
import TasksPage from "../pages/TasksPage";
import TaskFormPage from "../pages/TaskFormPage";
import TaskDetailsPage from "../pages/TaskDetailsPage";
import ObservationsPage from "../pages/ObservationsPage";
import ClimatePage from "../pages/ClimatePage";
import ZonesPage from "../pages/ZonesPage";
import RegisterPage from "../pages/RegisterPage";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/plants" element={<PlantsPage />} />
      <Route path="/plants/new" element={<PlantFormPage />} />
      <Route path="/plants/:id" element={<PlantDetailsPage />} />

      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/tasks/new" element={<TaskFormPage />} />
      <Route path="/tasks/:id" element={<TaskDetailsPage />} />
      <Route path="/tasks/:id/edit" element={<TaskFormPage />} />

      <Route path="/observations" element={<ObservationsPage />} />
      <Route path="/climate" element={<ClimatePage />} />
      <Route path="/zones" element={<ZonesPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}