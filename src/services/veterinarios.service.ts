import api from './api';

export const getVeterinarios = () => api.get('/veterinarios');
export const getVeterinarioById = (id: any) => api.get(`/veterinarios/${id}`);
