import api from './api';

export const createCita = (data: any) => api.post('/citas', data);
export const getCitas = () => api.get('/citas');
export const getCitasByMascota = (mascotaId: any) => api.get(`/citas/mascota/${mascotaId}`);
export const getCitasByVeterinario = (veterinarioId: any) => api.get(`/citas/veterinario/${veterinarioId}`);
export const getCitaById = (id: any) => api.get(`/citas/${id}`);
export const updateCita = (id: any, data: any) => api.patch(`/citas/${id}`, data);
export const deleteCita = (id: any) => api.delete(`/citas/${id}`);
