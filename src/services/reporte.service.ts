import api from './api';

export const create = (data: any) => api.post(`/reportes`, data);
export const findAll = () => api.get(`/reportes`);
export const findByTipo = (tipoReporte: any) => api.get(`/reportes/tipo/${tipoReporte}`);
export const findByAdmin = (adminId: any) => api.get(`/reportes/admin/${adminId}`);
export const findOne = (id: any) => api.get(`/reportes/${id}`);
export const update = (id: any, data: any) => api.patch(`/reportes/${id}`, data);
export const remove = (id: any) => api.delete(`/reportes/${id}`);
