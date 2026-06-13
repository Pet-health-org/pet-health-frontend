import api from './api';

export const invite = (data: { email: string; tipoAcceso: 'backend' | 'frontend' }) => api.post(`/integrantes/invite`, data);
export const registerIntegrante = (data: any) => api.post(`/integrantes/register`, data);
export const findAllIntegrantes = () => api.get(`/integrantes`);
