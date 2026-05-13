import api from './api';

export const createMascota = (data: any) => api.post('/mascotas', data);
export const getMascotas = () => api.get('/mascotas');
export const getMascotaById = (id: any) => api.get(`/mascotas/${id}`);
export const updateMascota = (id: any, data: any) => api.put(`/mascotas/${id}`, data);
export const deleteMascota = (id: any) => api.delete(`/mascotas/${id}`);
export const getMascotasByDueno = (duenoId: any) => api.get(`/mascotas/dueno/${duenoId}`);
