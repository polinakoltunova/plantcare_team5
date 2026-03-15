import api from "./api";

export const getTasks = (status, assignedUserId) => {
  const params = {};
  if (status) params.status = status;
  if (assignedUserId) params.assigned_user_id = assignedUserId;
  return api.get("/tasks", { params });
};

export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const getTaskHistory = (id) => api.get(`/tasks/${id}/history`);
export const completeTask = (id, data) => api.post(`/tasks/${id}/complete`, data);
export const reportTaskProblem = (id, data) => api.post(`/tasks/${id}/problem`, data);