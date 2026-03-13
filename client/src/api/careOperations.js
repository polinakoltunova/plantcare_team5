import api from "./api";
export const getCareOperations = () => {
  return api.get("/care-operations");
};
export const getCareOperation = (id) => {
  return api.get(`/care-operations/${id}`);
};
export const createCareOperation = (data) => {
  return api.post("/care-operations", data);
};
export const updateCareOperation = (id, data) => {
  return api.put(`/care-operations/${id}`, data);
};
export const deleteCareOperation = (id) => {
  return api.delete(`/care-operations/${id}`);
};
