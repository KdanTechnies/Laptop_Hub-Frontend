import axios from 'axios';

const api = axios.create({
  // Change 127.0.0.1 to localhost to match your browser URL
  baseURL: 'http://localhost:8000', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;