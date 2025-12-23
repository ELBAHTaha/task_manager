import axios from "axios";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email, password, firstName, lastName) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  // Get all projects (basic list)
  getAll: async () => {
    const response = await api.get("/projects");
    return response.data;
  },

  // Get paginated projects
  getPaginated: async (
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc",
  ) => {
    const response = await api.get("/projects/paginated", {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  // Search projects
  search: async (searchTerm, page = 0, size = 10) => {
    const response = await api.get("/projects/search", {
      params: { q: searchTerm, page, size },
    });
    return response.data;
  },

  // Get single project
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create project
  create: async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
  },

  // Update project
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    await api.delete(`/projects/${id}`);
  },

  // Get project progress
  getProgress: async (id) => {
    const response = await api.get(`/projects/${id}/progress`);
    return response.data;
  },

  // Update project status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/projects/${id}/status`, { status });
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  // Get all tasks for a project
  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  // Get paginated tasks for a project
  getPaginated: async (
    projectId,
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDir = "desc",
  ) => {
    const response = await api.get(`/projects/${projectId}/tasks/paginated`, {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },

  // Search and filter tasks
  searchAndFilter: async (
    projectId,
    {
      searchTerm = "",
      completed = null,
      priority = null,
      status = null,
      page = 0,
      size = 10,
      sortBy = "createdAt",
      sortDir = "desc",
    } = {},
  ) => {
    const params = { page, size, sortBy, sortDir };

    if (searchTerm) params.search = searchTerm;
    if (completed !== null) params.completed = completed;
    if (priority) params.priority = priority;
    if (status) params.status = status;

    const response = await api.get(`/projects/${projectId}/tasks/search`, {
      params,
    });
    return response.data;
  },

  // Get single task
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  create: async (projectId, taskData) => {
    const response = await api.post(`/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  // Update task
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  delete: async (id) => {
    await api.delete(`/tasks/${id}`);
  },

  // Mark task as completed
  complete: async (id) => {
    const response = await api.put(`/tasks/${id}/complete`);
    return response.data;
  },

  // Toggle task completion status
  toggle: async (id) => {
    const response = await api.put(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Update task status (legacy method)
  updateStatus: async (id, status) => {
    const response = await api.put(`/tasks/${id}/toggle`);
    return response.data;
  },

  // Update task priority
  updatePriority: async (id, priority) => {
    const response = await api.patch(`/tasks/${id}/priority`, { priority });
    return response.data;
  },

  // Get overdue tasks
  getOverdue: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks/overdue`);
    return response.data;
  },

  // Get tasks due today
  getDueToday: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks/due-today`);
    return response.data;
  },

  // Get tasks due soon
  getDueSoon: async (projectId, days = 7) => {
    const response = await api.get(`/projects/${projectId}/tasks/due-soon`, {
      params: { days },
    });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getRecentActivity: async (limit = 10) => {
    const response = await api.get("/dashboard/recent-activity", {
      params: { limit },
    });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get("/actuator/health");
    return response.data;
  },
};

// Export default api instance for custom calls
export default api;

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return "An unexpected error occurred";
  }
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};

export const isClientError = (error) => {
  return error.response?.status >= 400 && error.response?.status < 500;
};
