import api from './api';

export const autorizado = (data: any) => api.post(`/auth/login`, data);
export const login = autorizado;
export const refreshToken = (data: any) => api.post(`/auth/refresh`, data);
