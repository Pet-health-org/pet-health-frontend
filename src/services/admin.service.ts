import api from './api';

export const getAdmins = () => api.get('/admin');
export const getAdminById = (id: any) => api.get(`/admin/${id}`);
export const deleteAdmin = (id: any) => api.delete(`/admin/${id}`);
