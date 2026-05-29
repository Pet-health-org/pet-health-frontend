import api from './api';

export const findAll = () => api.get(`/admin`);
export const findOne = (id: any) => api.get(`/admin/${id}`);
export const update = (id: any, data: any) => api.patch(`/admin/${id}`, data);
export const remove = (id: any) => api.delete(`/admin/${id}`);
