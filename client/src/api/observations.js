import api from "./api";
export const getObservations = (plant_id, zone_id, task_id) => {
  let url = "/observations";
  const params = [];
  if (plant_id) params.push(`plant_id=${plant_id}`);
  if (zone_id) params.push(`zone_id=${zone_id}`);
  if (task_id) params.push(`task_id=${task_id}`);
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }
  return api.get(url);
};
export const getObservation = (id) => {
  return api.get(`/observations/${id}`);
};
export const createObservation = (data) => {
  return api.post("/observations", data);
};
export const updateObservation = (id, data) => {
  return api.put(`/observations/${id}`, data);
};
export const deleteObservation = (id) => {
  return api.delete(`/observations/${id}`);
};
