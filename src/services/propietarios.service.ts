import api from './api';

export const getPropietarios = () => api.get('/propietarios');
export const getPropietarioById = (id: string) => api.get(`/propietarios/${id}`);
export const createPropietario = (data: any) => api.post('/users/register', data);
export const updatePropietario = (id: string, data: any) => api.patch(`/users/${id}`, data);
export const deletePropietario = (id: string) => api.delete(`/users/${id}`);
