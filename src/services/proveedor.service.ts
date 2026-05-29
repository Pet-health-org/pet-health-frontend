import api from './api';

export const create = (data: any) => api.post(`/proveedores`, data);
export const findAll = () => api.get(`/proveedores`);
export const findOne = (id: any) => api.get(`/proveedores/${id}`);
export const update = (id: any, data: any) => api.patch(`/proveedores/${id}`, data);
export const remove = (id: any) => api.delete(`/proveedores/${id}`);
