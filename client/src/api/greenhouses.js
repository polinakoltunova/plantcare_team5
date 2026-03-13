import api from "./api";
export const getGreenhouses = () => {
  return api.get("/greenhouses");
};
export const getGreenhouse = (id) => {
  return api.get(`/greenhouses/${id}`);
};
export const createGreenhouse = (data) => {
  return api.post("/greenhouses", data);
};
export const updateGreenhouse = (id, data) => {
  return api.put(`/greenhouses/${id}`, data);
};
export const deleteGreenhouse = (id) => {
  return api.delete(`/greenhouses/${id}`);
};
