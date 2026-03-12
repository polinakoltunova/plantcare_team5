import api from "./api";
export const login = (data) => {
  return api.post("/auth/login", data);
};
export const getCurrentUser = () => {
  return api.get("/auth/me");
};
