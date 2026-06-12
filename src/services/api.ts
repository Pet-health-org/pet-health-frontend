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
    if (error.response) {
      if (error.response.status === 401) {
        const token = localStorage.getItem('pethealth_token');
        if (token) {
          localStorage.removeItem('pethealth_token');
          localStorage.removeItem('pethealth_user');
          window.location.href = '/'; // Force redirect to home/login
        }
      } else if (error.response.status === 403) {
        // Disparar evento global para que la UI muestre mensaje de "Acceso Denegado"
        window.dispatchEvent(new CustomEvent('forbidden-access', {
          detail: error.response.data?.message || 'No tienes permiso para realizar esta acción.'
        }));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
