import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const citaServiceMock = vi.hoisted(() => ({
  getCitas: vi.fn(),
  createCita: vi.fn(),
  updateCita: vi.fn(),
  deleteCita: vi.fn(),
}));

vi.mock('../../services/cita.service', () => citaServiceMock);

import { useAppointments } from '../../features/appointments/hooks/useAppointments';

describe('Integración frontend - citas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    citaServiceMock.getCitas.mockResolvedValue({ data: [] });
    citaServiceMock.createCita.mockResolvedValue({ data: { id: 'appointment-1' } });
  });

  it('crea una cita usando el DTO esperado por el backend', async () => {
    const { result } = renderHook(() => useAppointments());

    await waitFor(() => expect(citaServiceMock.getCitas).toHaveBeenCalled());

    await act(async () => {
      await result.current.addAppointment({
        petId: 'pet-1',
        vetId: 'vet-1',
        date: '2026-06-10',
        time: '09:00',
        reason: 'Control general',
        durationMinutes: 30,
      });
    });

    expect(citaServiceMock.createCita).toHaveBeenCalledWith({
      mascotaId: 'pet-1',
      veterinarioId: 'vet-1',
      fechaHora: new Date('2026-06-10T09:00:00').toISOString(),
      motivo: 'Control general',
      estado: 'pendiente',
    });
  });

  it('bloquea el guardado si detecta conflicto de horario local', async () => {
    citaServiceMock.getCitas.mockResolvedValue({
      data: [
        {
          id: 'appointment-1',
          mascotaId: 'pet-1',
          veterinarioId: 'vet-1',
          fechaHora: new Date('2026-06-10T09:00:00').toISOString(),
          motivo: 'Consulta existente',
          estado: 'pendiente',
          createdAt: '2026-06-01T00:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => useAppointments());

    await waitFor(() => expect(result.current.appointments).toHaveLength(1));

    let response: Awaited<ReturnType<typeof result.current.addAppointment>> | undefined;
    await act(async () => {
      response = await result.current.addAppointment({
        petId: 'pet-2',
        vetId: 'vet-1',
        date: '2026-06-10',
        time: '09:00',
        reason: 'Vacunación',
        durationMinutes: 30,
      });
    });

    expect(response).toEqual({
      success: false,
      message: 'El veterinario tiene un conflicto de horario.',
    });
    expect(citaServiceMock.createCita).not.toHaveBeenCalled();
  });
});
