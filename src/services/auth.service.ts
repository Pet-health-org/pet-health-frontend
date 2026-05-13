import api from './api';

export const login = (credentials: any) => api.post('/auth/login', credentials);
export const refreshToken = () => api.post('/auth/refresh');
