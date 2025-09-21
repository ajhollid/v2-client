import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: "http://localhost:55555/api/v1",
  withCredentials: true,
});

export const get = <T,>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => api.get<T>(url, config);

export const post = <T,>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => api.post<T>(url, data, config);

export default api;
