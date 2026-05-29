import api from './api';

export const create = (data: any) => api.post(`/medicamentos`, data);
export const findAll = () => api.get(`/medicamentos`);
export const findByHistoriaClinica = (historiaClinicaId: any) => api.get(`/medicamentos/historia/${historiaClinicaId}`);
export const findOne = (id: any) => api.get(`/medicamentos/${id}`);
export const update = (id: any, data: any) => api.patch(`/medicamentos/${id}`, data);
export const remove = (id: any) => api.delete(`/medicamentos/${id}`);
