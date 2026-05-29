import api from './api';

export const create = (data: any) => api.post(`/vacunas`, data);
export const findAll = () => api.get(`/vacunas`);
export const findByHistoriaClinica = (historiaClinicaId: any) => api.get(`/vacunas/historia/${historiaClinicaId}`);
export const findOne = (id: any) => api.get(`/vacunas/${id}`);
export const update = (id: any, data: any) => api.patch(`/vacunas/${id}`, data);
export const remove = (id: any) => api.delete(`/vacunas/${id}`);
