import api from './api';

export const create = (data: any) => api.post(`/especies`, data);
export const findAll = () => api.get(`/especies`);
export const findOne = (id: any) => api.get(`/especies/${id}`);
export const getConstantes = (especieId: any) => api.get(`/especies/${especieId}/constantes`);
export const updateConstantes = (especieId: any, data: any) => api.put(`/especies/${especieId}/constantes`, data);
export const update = (id: any, data: any) => api.patch(`/especies/${id}`, data);
export const remove = (id: any) => api.delete(`/especies/${id}`);
