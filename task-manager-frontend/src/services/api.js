import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: 'http://localhost:8081', // your Spring Boot backend
});

// Request interceptor: attach JWT except for login
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth/login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

// Projects
export async function fetchProjects() {
  const res = await api.get('/projects');
  return res.data;
}

export async function createProject(payload) {
  const res = await api.post('/projects', payload);
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
