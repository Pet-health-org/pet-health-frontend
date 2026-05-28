import api from './api';
import { getHistoriasClinicasByMascota } from './historias-clinicas.service';

export const createVacuna = (data: any) => api.post('/vacunas', data);
export const getVacunas = () => api.get('/vacunas');
export const getVacunaById = (id: any) => api.get(`/vacunas/${id}`);
export const updateVacuna = (id: any, data: any) => api.patch(`/vacunas/${id}`, data);
export const deleteVacuna = (id: any) => api.delete(`/vacunas/${id}`);
export const getVacunasByHistoria = (historiaClinicaId: any) => api.get(`/vacunas/historia/${historiaClinicaId}`);
export const getVacunasByMascota = async (mascotaId: any) => {
  const historiesResponse = await getHistoriasClinicasByMascota(mascotaId);
  const histories = historiesResponse.data || [];

  const vaccineResponses = await Promise.all(
    histories.map((history: any) => getVacunasByHistoria(history.id).then(res => res.data).catch(() => []))
  );

  return {
    data: vaccineResponses.flat(),
  };
};
