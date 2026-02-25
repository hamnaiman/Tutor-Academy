
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach token automatically (future safe)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || "Server error, try again";
    return Promise.reject(new Error(message));
  }
);

export default api;
