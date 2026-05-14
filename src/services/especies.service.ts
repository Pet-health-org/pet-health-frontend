import api from './api';

export const getEspecies = () => api.get('/especies');
export const getEspecieById = (id: string) => api.get(`/especies/${id}`);
export const createEspecie = (data: any) => api.post('/especies', data);
export const updateEspecie = (id: string, data: any) => api.patch(`/especies/${id}`, data);
export const deleteEspecie = (id: string) => api.delete(`/especies/${id}`);
