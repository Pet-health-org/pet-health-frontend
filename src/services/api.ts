import axios from 'axios';

const getBaseUrl = (): string => {
  try {
    return import.meta.env.VITE_API_URL || '/api';
  } catch (e) {
    return '/api';
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
        if (!error.config?.url?.includes('silent=true')) {
          window.dispatchEvent(new CustomEvent('forbidden-access', {
            detail: error.response.data?.message || 'No tienes permiso para realizar esta acción.'
          }));
        }
      }
    }
    
    // Format error message to be more user friendly
    if (error.response?.data?.message) {
      const msg = error.response.data.message;
      if (Array.isArray(msg)) {
        error.response.data.message = 'Revisa los campos: ' + msg.join(', ');
      } else if (typeof msg === 'string' && msg === 'Internal server error') {
        error.response.data.message = 'Ha ocurrido un error interno en el servidor.';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
