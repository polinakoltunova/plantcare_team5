import api from "./api";
export const getClimateMeasurements = (zone_id) => {
  if (zone_id) {
    return api.get(`/climate?zone_id=${zone_id}`);
  }
  return api.get("/climate");
};
export const getClimateMeasurement = (id) => {
  return api.get(`/climate/${id}`);
};
export const createClimateMeasurement = (data) => {
  return api.post("/climate", data);
};
export const updateClimateMeasurement = (id, data) => {
  return api.put(`/climate/${id}`, data);
};
export const deleteClimateMeasurement = (id) => {
  return api.delete(`/climate/${id}`);
};
