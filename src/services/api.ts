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
    // Only logout if we had a token and got a 401
    const token = localStorage.getItem('pethealth_token');
    if (error.response && error.response.status === 401 && token) {
      localStorage.removeItem('pethealth_token');
      localStorage.removeItem('pethealth_user');
      window.location.href = '/'; // Force redirect to home/login
    }
    return Promise.reject(error);
  }
);

// Funciones para interactuar con los endpoints del backend

// Admin
export const getAdmins = () => api.get('/admin');
export const getAdminById = (id: any) => api.get(`/admin/${id}`);
export const deleteAdmin = (id: any) => api.delete(`/admin/${id}`);

// Auth
export const login = (credentials: any) => api.post('/auth/login', credentials);
export const refreshToken = () => api.post('/auth/refresh');

// Citas
export const createCita = (data: any) => api.post('/citas', data);
export const getCitas = () => api.get('/citas');
export const getCitasByMascota = (mascotaId: any) => api.get(`/citas/mascota/${mascotaId}`);
export const getCitasByVeterinario = (veterinarioId: any) => api.get(`/citas/veterinario/${veterinarioId}`);
export const getCitaById = (id: any) => api.get(`/citas/${id}`);
export const updateCita = (id: any, data: any) => api.put(`/citas/${id}`, data);
export const deleteCita = (id: any) => api.delete(`/citas/${id}`);

// Historias Clínicas
export const createHistoriaClinica = (data: any) => api.post('/historias-clinicas', data);
export const getHistoriasClinicas = () => api.get('/historias-clinicas');
export const getHistoriasClinicasByMascota = (mascotaId: any) => api.get(`/historias-clinicas/mascota/${mascotaId}`);
export const getHistoriaClinicaById = (id: any) => api.get(`/historias-clinicas/${id}`);
export const updateHistoriaClinica = (id: any, data: any) => api.put(`/historias-clinicas/${id}`, data);
export const deleteHistoriaClinica = (id: any) => api.delete(`/historias-clinicas/${id}`);

// Veterinarios
export const getVeterinarios = () => api.get('/veterinarios');
export const getVeterinarioById = (id: any) => api.get(`/veterinarios/${id}`);

// Medicamentos
export const createMedicamento = (data: any) => api.post('/medicamentos', data);
export const getMedicamentos = () => api.get('/medicamentos');
export const getMedicamentosByHistoria = (historiaClinicaId: any) => api.get(`/medicamentos/historia/${historiaClinicaId}`);

// Mascotas
export const createMascota = (data: any) => api.post('/mascotas', data);
export const getMascotas = () => api.get('/mascotas');
export const getMascotaById = (id: any) => api.get(`/mascotas/${id}`);
export const updateMascota = (id: any, data: any) => api.put(`/mascotas/${id}`, data);
export const deleteMascota = (id: any) => api.delete(`/mascotas/${id}`);
export const getMascotasByDueno = (duenoId: any) => api.get(`/mascotas/dueno/${duenoId}`);

// Inventario
export const createInventario = (data: any) => api.post('/inventario', data);
export const getInventarios = () => api.get('/inventario');
export const getInventarioById = (id: any) => api.get(`/inventario/${id}`);
export const updateInventario = (id: any, data: any) => api.put(`/inventario/${id}`, data);
export const deleteInventario = (id: any) => api.delete(`/inventario/${id}`);

// Vacunas
export const createVacuna = (data: any) => api.post('/vacunas', data);
export const getVacunas = () => api.get('/vacunas');
export const getVacunaById = (id: any) => api.get(`/vacunas/${id}`);
export const updateVacuna = (id: any, data: any) => api.put(`/vacunas/${id}`, data);
export const deleteVacuna = (id: any) => api.delete(`/vacunas/${id}`);
export const getVacunasByMascota = (mascotaId: any) => api.get(`/vacunas/mascota/${mascotaId}`);

// Reportes
export const getReportes = () => api.get('/reportes');
export const getReporteById = (id: any) => api.get(`/reportes/${id}`);
export const createReporte = (data: any) => api.post('/reportes', data);
export const deleteReporte = (id: any) => api.delete(`/reportes/${id}`);

// Notificaciones
export const createNotificacion = (data: any) => api.post('/notificaciones', data);
export const getNotificaciones = () => api.get('/notificaciones');
export const getNotificacionById = (id: any) => api.get(`/notificaciones/${id}`);
export const getNotificacionesByUsuario = (usuarioId: any) => api.get(`/notificaciones/usuario/${usuarioId}`);
export const markNotificacionAsRead = (id: any) => api.patch(`/notificaciones/${id}/read`);
export const deleteNotificacion = (id: any) => api.delete(`/notificaciones/${id}`);

export default api;
