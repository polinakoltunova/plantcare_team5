import api from "./api";
export const getTaskHistoryList = () => {
  return api.get("/task-history");
};
export const getTaskHistory = (id) => {
  return api.get(`/task-history/${id}`);
};
export const createTaskHistory = (data) => {
  return api.post("/task-history", data);
};
export const updateTaskHistory = (id, data) => {
  return api.put(`/task-history/${id}`, data);
};
export const deleteTaskHistory = (id) => {
  return api.delete(`/task-history/${id}`);
};
