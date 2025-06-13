import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://192.168.1.60:4000";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
