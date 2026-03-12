import api from "./api";
export const getZones = (greenhouse_id) => {
  if (greenhouse_id) {
    return api.get(`/zones?greenhouse_id=${greenhouse_id}`);
  }
  return api.get("/zones");
};
export const getZone = (id) => {
  return api.get(`/zones/${id}`);
};
export const createZone = (data) => {
  return api.post("/zones", data);
};
export const updateZone = (id, data) => {
  return api.put(`/zones/${id}`, data);
};
export const deleteZone = (id) => {
  return api.delete(`/zones/${id}`);
};
