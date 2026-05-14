import api from './api';

export const getRazas = () => api.get('/razas');
export const getRazasByEspecie = (especieId: string) => api.get(`/razas/especie/${especieId}`);
export const getRazaById = (id: string) => api.get(`/razas/${id}`);
export const createRaza = (data: any) => api.post('/razas', data);
export const updateRaza = (id: string, data: any) => api.patch(`/razas/${id}`, data);
export const deleteRaza = (id: string) => api.delete(`/razas/${id}`);
