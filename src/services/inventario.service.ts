import api from './api';

export const create = (data: any) => api.post(`/inventario`, data);
export const findAll = () => api.get(`/inventario`);
export const findBajoStock = () => api.get(`/inventario/bajo-stock`);
export const findByProveedor = (proveedorId: any) => api.get(`/inventario/proveedor/${proveedorId}`);
export const findByTipo = (tipo: any) => api.get(`/inventario/tipo/${tipo}`);
export const findOne = (id: any) => api.get(`/inventario/${id}`);
export const update = (id: any, data: any) => api.patch(`/inventario/${id}`, data);
export const updateStock = (id: any, data: any) => api.patch(`/inventario/${id}/stock`, data);
export const remove = (id: any) => api.delete(`/inventario/${id}`);

export const getInventarios = findAll;
export const createInventario = create;
export const updateInventario = update;
export const deleteInventario = remove;
