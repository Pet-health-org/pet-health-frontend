import api from './api';

export const createVacuna = (data: any) => api.post('/vacunas', data);
export const getVacunas = () => api.get('/vacunas');
export const getVacunaById = (id: any) => api.get(`/vacunas/${id}`);
export const updateVacuna = (id: any, data: any) => api.put(`/vacunas/${id}`, data);
export const deleteVacuna = (id: any) => api.delete(`/vacunas/${id}`);
export const getVacunasByMascota = (mascotaId: any) => api.get(`/vacunas/mascota/${mascotaId}`);
