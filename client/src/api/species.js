import api from "./api";
export const getSpecies = () => {
  return api.get("/species");
};
export const getSpeciesById = (id) => {
  return api.get(`/species/${id}`);
};
export const createSpecies = (data) => {
  return api.post("/species", data);
};
export const updateSpecies = (id, data) => {
  return api.put(`/species/${id}`, data);
};
export const deleteSpecies = (id) => {
  return api.delete(`/species/${id}`);
};
