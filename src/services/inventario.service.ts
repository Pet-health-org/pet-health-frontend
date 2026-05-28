import api from './api';

export const createInventario = (data: any) => api.post('/inventario', data);
export const getInventarios = () => api.get('/inventario');
export const getInventarioById = (id: any) => api.get(`/inventario/${id}`);
export const updateInventario = (id: any, data: any) => api.patch(`/inventario/${id}`, data);
export const deleteInventario = (id: any) => api.delete(`/inventario/${id}`);
