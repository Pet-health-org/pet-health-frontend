import api from './api';

export const create = (data: any) => api.post(`/consultas`, data);
