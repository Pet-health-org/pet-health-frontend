import api from "./api";

export const create = (data: any) => api.post(`/notificaciones`, data);
export const findAll = (params?: any) => api.get(`/notificaciones`, { params });
export const findByUsuario = (usuarioId: any) =>
  api.get(`/notificaciones/usuario/${usuarioId}`);
export const findByEstado = (estado: any) =>
  api.get(`/notificaciones/estado/${estado}`);
export const findOne = (id: any) => api.get(`/notificaciones/${id}`);
export const update = (id: any, data: any) =>
  api.patch(`/notificaciones/${id}`, data);
export const reenviar = (id: any) => api.post(`/notificaciones/${id}/reenviar`);
export const remove = (id: any) => api.delete(`/notificaciones/${id}`);

export const getNotificaciones = findAll;
export const reenviarNotificacion = reenviar;
