import api from './api';

export const getReportes = () => api.get('/reportes');
export const getReporteById = (id: any) => api.get(`/reportes/${id}`);
export const createReporte = (data: any) => api.post('/reportes', data);
export const deleteReporte = (id: any) => api.delete(`/reportes/${id}`);
