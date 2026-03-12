import api from "./api";
export const getPlants = (zone_id, search) => {
  let url = "/plants";
  const params = [];
  if (zone_id) params.push(`zone_id=${zone_id}`);
  if (search) params.push(`search=${search}`);
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }
  return api.get(url);
};
export const getPlant = (id) => {
  return api.get(`/plants/${id}`);
};
export const createPlant = (data) => {
  return api.post("/plants", data);
};
export const updatePlant = (id, data) => {
  return api.put(`/plants/${id}`, data);
};
export const deletePlant = (id) => {
  return api.delete(`/plants/${id}`);
};
