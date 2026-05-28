import api from './api';

export const getProveedores = () => api.get('/proveedores');
export const getProveedorById = (id: any) => api.get(`/proveedores/${id}`);
export const createProveedor = (data: any) => api.post('/proveedores', data);
export const updateProveedor = (id: any, data: any) => api.patch(`/proveedores/${id}`, data);
export const deleteProveedor = (id: any) => api.delete(`/proveedores/${id}`);
