import api from './api';

export const create = (data: any) => api.post(`/razas`, data);
export const findAll = () => api.get(`/razas`);
export const findByEspecie = (especieId: any) => api.get(`/razas/especie/${especieId}`);
export const findOne = (id: any) => api.get(`/razas/${id}`);
export const update = (id: any, data: any) => api.patch(`/razas/${id}`, data);
export const remove = (id: any) => api.delete(`/razas/${id}`);
