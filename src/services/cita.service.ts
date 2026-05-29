import api from './api';

export const create = (data: any) => api.post(`/citas`, data);
export const findAll = () => api.get(`/citas`);
export const findByMascota = (mascotaId: any) => api.get(`/citas/mascota/${mascotaId}`);
export const findByVeterinario = (veterinarioId: any) => api.get(`/citas/veterinario/${veterinarioId}`);
export const findOne = (id: any) => api.get(`/citas/${id}`);
export const update = (id: any, data: any) => api.patch(`/citas/${id}`, data);
export const remove = (id: any) => api.delete(`/citas/${id}`);
