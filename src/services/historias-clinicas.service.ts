import api from './api';

export const createHistoriaClinica = (data: any) => api.post('/historias-clinicas', data);
export const getHistoriasClinicas = () => api.get('/historias-clinicas');
export const getHistoriasClinicasByMascota = (mascotaId: any) => api.get(`/historias-clinicas/mascota/${mascotaId}`);
export const getHistoriaClinicaById = (id: any) => api.get(`/historias-clinicas/${id}`);
export const updateHistoriaClinica = (id: any, data: any) => api.put(`/historias-clinicas/${id}`, data);
export const deleteHistoriaClinica = (id: any) => api.delete(`/historias-clinicas/${id}`);
