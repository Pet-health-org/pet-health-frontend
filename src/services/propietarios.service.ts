import api from './api';

export const getPropietarios = () => api.get('/propietarios');
export const getPropietarioById = (id: string) => api.get(`/propietarios/${id}`);
export const createPropietario = (data: any) => api.post('/propietarios', data);
export const updatePropietario = (id: string, data: any) => api.patch(`/propietarios/${id}`, data);
export const deletePropietario = (id: string) => api.delete(`/propietarios/${id}`);
