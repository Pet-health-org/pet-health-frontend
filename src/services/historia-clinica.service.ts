import api from './api';

export const create = (data: any) => api.post(`/historias-clinicas`, data);
export const findAll = () => api.get(`/historias-clinicas`);
export const findByMascota = (mascotaId: any) => api.get(`/historias-clinicas/mascota/${mascotaId}`);
export const findOne = (id: any) => api.get(`/historias-clinicas/${id}`);
export const update = (id: any, data: any) => api.patch(`/historias-clinicas/${id}`, data);
export const remove = (id: any) => api.delete(`/historias-clinicas/${id}`);
