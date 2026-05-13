import axios from 'axios';

const getBaseUrl = (): string => {
  try {
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';
  } catch (e) {
    return 'http://127.0.0.1:3000';
  }
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pethealth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('pethealth_token');
    if (error.response && error.response.status === 401 && token) {
      localStorage.removeItem('pethealth_token');
      localStorage.removeItem('pethealth_user');
      window.location.href = '/'; // Force redirect to home/login
    }
    return Promise.reject(error);
  }
);

// Additional functions for backend interaction
export const getVacunas = async () => api.get('/vacunas');
export const createVacuna = async (data) => api.post('/vacunas', data);
export const getVacunasByHistoriaClinica = async (id) => api.get(`/historias-clinicas/${id}/vacunas`);

export default api;
