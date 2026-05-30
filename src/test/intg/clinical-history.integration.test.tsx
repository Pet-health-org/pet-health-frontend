import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const historiaServiceMock = vi.hoisted(() => ({
  getHistoriasClinicas: vi.fn(),
  createHistoriaClinica: vi.fn(),
  getHistoriasClinicasByMascota: vi.fn(),
}));

vi.mock('../../services/historia-clinica.service', () => historiaServiceMock);

import { useConsultations } from '../../features/clinical-history/hooks/useConsultations';

describe('Integración frontend - historia clínica', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    historiaServiceMock.getHistoriasClinicas.mockResolvedValue({ data: [] });
    historiaServiceMock.createHistoriaClinica.mockResolvedValue({ data: { id: 'history-1' } });
  });

  it('guarda una consulta serializando los datos extendidos en observaciones', async () => {
    const { result } = renderHook(() => useConsultations());

    await waitFor(() => expect(historiaServiceMock.getHistoriasClinicas).toHaveBeenCalled());

    await act(async () => {
      await result.current.addConsultation({
        petId: 'pet-1',
        date: '2026-06-11T10:00:00.000Z',
        reason: 'Vómito persistente',
        anamnesis: 'Inicio hace 24 horas',
        physicalExam: 'Mucosas levemente pálidas',
        vitals: {
          weight: 7.5,
          temperature: 39.1,
          heartRate: 115,
          respiratoryRate: 28,
        },
        diagnosis: 'Gastroenteritis',
        treatment: 'Suero oral y dieta blanda',
        vetName: 'Dra. Ruiz',
      });
    });

    expect(historiaServiceMock.createHistoriaClinica).toHaveBeenCalledTimes(1);
    const payload = historiaServiceMock.createHistoriaClinica.mock.calls[0][0];

    expect(payload).toMatchObject({
      mascotaId: 'pet-1',
      fecha: new Date('2026-06-11T10:00:00.000Z').toISOString(),
      diagnostico: 'Gastroenteritis',
      tratamiento: 'Suero oral y dieta blanda',
    });

    expect(JSON.parse(payload.observaciones)).toEqual({
      reason: 'Vómito persistente',
      anamnesis: 'Inicio hace 24 horas',
      physicalExam: 'Mucosas levemente pálidas',
      vitals: {
        weight: 7.5,
        temperature: 39.1,
        heartRate: 115,
        respiratoryRate: 28,
      },
      vetName: 'Dra. Ruiz',
    });
  });

  it('carga y ordena la historia clínica de una mascota en orden cronológico descendente', async () => {
    historiaServiceMock.getHistoriasClinicas.mockResolvedValue({
      data: [
        {
          id: 'old-history',
          mascotaId: 'pet-1',
          fecha: '2026-01-02T10:00:00.000Z',
          diagnostico: 'Otitis',
          tratamiento: 'Gotas óticas',
          observaciones: JSON.stringify({ reason: 'Rascado de oreja' }),
        },
        {
          id: 'new-history',
          mascotaId: 'pet-1',
          fecha: '2026-05-02T10:00:00.000Z',
          diagnostico: 'Dermatitis',
          tratamiento: 'Antihistamínico',
          observaciones: JSON.stringify({ reason: 'Picazón' }),
        },
      ],
    });

    const { result } = renderHook(() => useConsultations());

    await waitFor(() => expect(result.current.consultations).toHaveLength(2));

    const petHistory = result.current.getPetHistory('pet-1');

    expect(petHistory.map((item) => item.id)).toEqual(['new-history', 'old-history']);
    expect(petHistory[0]).toMatchObject({
      diagnosis: 'Dermatitis',
      treatment: 'Antihistamínico',
      reason: 'Picazón',
    });
  });
});
