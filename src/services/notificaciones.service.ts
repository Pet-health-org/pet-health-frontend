import api from './api';

export const createNotificacion = (data: any) => api.post('/notificaciones', data);
export const getNotificaciones = () => api.get('/notificaciones');
export const getNotificacionById = (id: any) => api.get(`/notificaciones/${id}`);
export const getNotificacionesByUsuario = (usuarioId: any) => api.get(`/notificaciones/usuario/${usuarioId}`);
export const markNotificacionAsRead = (id: any) => api.patch(`/notificaciones/${id}/read`);
export const deleteNotificacion = (id: any) => api.delete(`/notificaciones/${id}`);
