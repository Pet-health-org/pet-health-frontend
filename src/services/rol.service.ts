import api from './api';

export const create = (data: any) => api.post(`/roles`, data);
export const findAll = () => api.get(`/roles`);
export const findOne = (id: any) => api.get(`/roles/${id}`);
export const update = (id: any, data: any) => api.patch(`/roles/${id}`, data);
export const remove = (id: any) => api.delete(`/roles/${id}`);
