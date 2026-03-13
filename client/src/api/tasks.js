import api from "./api";
export const getTasks = (status, assigned_user_id) => {
  let url = "/tasks";
  const params = [];
  if (status) params.push(`status=${status}`);
  if (assigned_user_id) params.push(`assigned_user_id=${assigned_user_id}`);
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }
  return api.get(url);
};
export const getTask = (id) => {
  return api.get(`/tasks/${id}`);
};
export const createTask = (data) => {
  return api.post("/tasks", data);
};
export const updateTask = (id, data) => {
  return api.put(`/tasks/${id}`, data);
};
export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};
export const getTaskHistory = (id) => {
  return api.get(`/tasks/${id}/history`);
};
export const completeTask = (id, data) => {
  return api.post(`/tasks/${id}/complete`, data);
};
export const reportTaskProblem = (id, data) => {
  return api.post(`/tasks/${id}/problem`, data);
};
