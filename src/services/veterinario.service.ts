import api from './api';

export const getDisponibilidadGeneral = () => api.get(`/veterinarios/disponibilidad`);
export const getDisponibilidadVeterinario = (id: any) => api.get(`/veterinarios/${id}/disponibilidad`);
export const findAll = () => api.get(`/veterinarios`);
export const findOne = (id: any) => api.get(`/veterinarios/${id}`);
