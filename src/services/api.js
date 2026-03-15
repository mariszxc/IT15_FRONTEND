import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api`
    : "/api")
).replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    return Promise.reject(error);
  }
);

export const loginRequest = (payload) => api.post("/login", payload);
export const registerRequest = (payload) => api.post("/register", payload);
export const meRequest = () => api.get("/me");
export const logoutRequest = () => api.post("/logout");
export const dashboardMetricsRequest = () => api.get("/dashboard");
export const coursesRequest = (params = {}) => api.get("/courses", { params });
export const schoolDaysRequest = (params = {}) => api.get("/school-days", { params });
export const enrollmentRecordsRequest = (params = {}) => api.get("/enrollments", { params });
export const enrollStudentRequest = (payload) => api.post("/enrollments", payload);
export const activityLogsRequest = (params = {}) => api.get("/activities", { params });
export const storeActivityRequest = (payload) => api.post("/activities", payload);

export default api;
