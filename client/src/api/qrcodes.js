import api from "./api";
export const getQRCodes = () => {
  return api.get("/qr-codes");
};
export const getQRCode = (id) => {
  return api.get(`/qr-codes/${id}`);
};
export const createQRCode = (data) => {
  return api.post("/qr-codes", data);
};
export const updateQRCode = (id, data) => {
  return api.put(`/qr-codes/${id}`, data);
};
export const deleteQRCode = (id) => {
  return api.delete(`/qr-codes/${id}`);
};
