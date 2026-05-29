import api from './api';

export const findAll = () => api.get(`/recepcionistas`);
export const findOne = (id: any) => api.get(`/recepcionistas/${id}`);
