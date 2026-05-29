import api from './api';

export const create = (data: any) => api.post(`/propietarios`, data);
export const findAll = () => api.get(`/propietarios`);
export const findOne = (id: any) => api.get(`/propietarios/${id}`);
export const update = (id: any, data: any) => Promise.resolve({ data: true }); // Mock since backend lacks this endpoint
export const remove = (id: any) => Promise.resolve({ data: true }); // Mock since backend lacks this endpoint
