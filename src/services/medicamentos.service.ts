import api from './api';

export const createMedicamento = (data: any) => api.post('/medicamentos', data);
export const getMedicamentos = () => api.get('/medicamentos');
export const getMedicamentosByHistoria = (historiaClinicaId: any) => api.get(`/medicamentos/historia/${historiaClinicaId}`);
