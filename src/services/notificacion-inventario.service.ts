import api from './api';

export const create = (data: any) => api.post(`/notificaciones-inventario`, data);
export const findAll = () => api.get(`/notificaciones-inventario`);
export const findOne = (id: any) => api.get(`/notificaciones-inventario/${id}`);
export const update = (id: any, data: any) => api.patch(`/notificaciones-inventario/${id}`, data);
export const remove = (id: any) => api.delete(`/notificaciones-inventario/${id}`);
