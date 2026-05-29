import api from './api';

export const create = (data: any) => api.post(`/mascotas`, data);
export const findAll = () => api.get(`/mascotas`);
export const findByPropietario = (propietarioId: any) => api.get(`/mascotas/propietario/${propietarioId}`);
export const findOne = (id: any) => api.get(`/mascotas/${id}`);
export const update = (id: any, data: any) => api.patch(`/mascotas/${id}`, data);
export const remove = (id: any) => api.delete(`/mascotas/${id}`);

export const getMascotas = findAll;
export const getMascotaById = findOne;
