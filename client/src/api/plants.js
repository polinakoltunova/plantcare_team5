import api from "./api";

export const getPlants = (page = 1, limit = 1000) => {
  return api.get("/plants", { params: { page, limit } });
};

export const getPlant = (id) => api.get(`/plants/${id}`);

export const createPlant = (data) => api.post("/plants", data);

export const updatePlant = (id, data) => api.put(`/plants/${id}`, data);

export const deletePlant = (id) => api.delete(`/plants/${id}`);

export const getPlantSchedule = (id) => api.get(`/plants/${id}/schedule`);