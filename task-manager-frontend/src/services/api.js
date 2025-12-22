import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: "http://localhost:8081", // your Spring Boot backend
});

// Request interceptor: attach JWT except for login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url.includes("/auth/login")) {
      // Check if token is expired before making request
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          // Token expired, clear storage and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          window.location.href = "/login";
          return Promise.reject(new Error("Token expired"));
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Invalid token format, clear storage and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/login";
        return Promise.reject(new Error("Invalid token"));
      }
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token might be expired or invalid
      const currentUrl = window.location.pathname;
      if (currentUrl !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// Projects
export async function fetchProjects() {
  const res = await api.get("/projects");
  return res.data;
}

export async function createProject(payload) {
  const res = await api.post("/projects", payload);
  return res.data;
}

export async function fetchProject(projectId) {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
}

// Tasks
export async function fetchTasks(projectId) {
  const res = await api.get(`/projects/${projectId}/tasks`);
  return res.data;
}

export async function createTask(projectId, payload) {
  const res = await api.post(`/projects/${projectId}/tasks`, payload);
  return res.data;
}

export async function completeTask(taskId) {
  const res = await api.put(`/tasks/${taskId}/complete`);
  return res.data;
}

export async function deleteTask(taskId) {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
}

export async function fetchProjectProgress(projectId) {
  const res = await api.get(`/projects/${projectId}/progress`);
  return res.data;
}

export default api;
