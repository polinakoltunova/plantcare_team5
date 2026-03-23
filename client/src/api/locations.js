import api from "./api";

export const getLocations = (zoneId) =>
  api.get(`/zones/${zoneId}/locations`);
