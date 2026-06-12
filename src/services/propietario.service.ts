import api from './api';

export const create = (data: any) => api.post(`/propietarios`, data);
export const findAll = () => api.get(`/propietarios?silent=true`);
export const findOne = (id: any) => api.get(`/propietarios/${id}?silent=true`);
export const update = (id: any, data: any) => Promise.resolve({ data: true }); // Mock since backend lacks this endpoint
export const remove = (id: any) => Promise.resolve({ data: true }); // Mock since backend lacks this endpoint

export const getPropietarios = findAll;
export const getPropietarioById = findOne;
