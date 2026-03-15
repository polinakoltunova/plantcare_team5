import api from "./api";

export const getObservations = (plantId, taskId) => {
  const params = {};
  if (plantId) params.plant_id = plantId;
  if (taskId) params.task_id = taskId;
  return api.get("/observations", { params });
};

export const getObservation = (id) => api.get(`/observations/${id}`);
export const createObservation = (data) => api.post("/observations", data);