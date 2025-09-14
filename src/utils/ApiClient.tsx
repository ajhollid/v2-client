import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:55555/api/v1",
  withCredentials: true,
});

export const get = (url: string, config = {}) => api.get(url, config);
export const post = (url: string, data: any, config = {}) =>
  api.post(url, data, config);

export default api;
