import api from './api';

export const register = (data: any) => api.post(`/users/register`, data);
export const getProfile = () => api.get(`/users/profile`);
export const findAll = () => api.get(`/users`);
export const findOne = (id: any) => api.get(`/users/${id}`);
export const update = (id: any, data: any) => api.patch(`/users/${id}`, data);
export const changeStatus = (id: any, status: any, data: any) => api.patch(`/users/${id}/status/${status}`, data);
export const remove = (id: any) => api.delete(`/users/${id}`);
