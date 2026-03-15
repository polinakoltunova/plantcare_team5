import api from "./api";

export const getPlants = (zoneId, search) => {
  const params = {};
  if (zoneId) params.zone_id = zoneId;
  if (search) params.search = search;
  return api.get("/plants", { params });
};

export const getPlant = (id) => api.get(`/plants/${id}`);
export const createPlant = (data) => api.post("/plants", data);
export const updatePlant = (id, data) => api.put(`/plants/${id}`, data);
export const deletePlant = (id) => api.delete(`/plants/${id}`);
export const getPlantSchedule = (id) => api.get(`/plants/${id}/schedule`);