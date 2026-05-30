import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const vacunaServiceMock = vi.hoisted(() => ({
  getVacunas: vi.fn(),
  createVacuna: vi.fn(),
}));

vi.mock('../../services/vacuna.service', () => vacunaServiceMock);

import { useVaccines } from '../../features/vaccinations/hooks/useVaccines';

const toIsoInDays = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

describe('Integración frontend - vacunación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vacunaServiceMock.getVacunas.mockResolvedValue({ data: [] });
    vacunaServiceMock.createVacuna.mockResolvedValue({ data: { id: 'vaccine-1' } });
  });

  it('mapea vacunas del backend y calcula las pendientes dentro de 15 días', async () => {
    vacunaServiceMock.getVacunas.mockResolvedValue({
      data: [
        {
          id: 'soon-vaccine',
          nombre: 'Antirrábica',
          fechaAplicacion: toIsoInDays(-350),
          fechaProximoRefuerzo: toIsoInDays(10),
          lote: 'LOT-001',
          dosis: '1 ml',
          inventario: { fechaVencimiento: toIsoInDays(180) },
          historiaClinica: {
            mascotaId: 'pet-1',
            veterinarioId: 'vet-1',
            observaciones: 'Aplicación sin novedad',
          },
        },
        {
          id: 'later-vaccine',
          nombre: 'Triple felina',
          fechaAplicacion: toIsoInDays(-20),
          fechaProximoRefuerzo: toIsoInDays(45),
          lote: 'LOT-002',
          dosis: '0.5 ml',
          inventario: { fechaVencimiento: toIsoInDays(200) },
          historiaClinica: { mascotaId: 'pet-2', veterinarioId: 'vet-2' },
        },
      ],
    });

    const { result } = renderHook(() => useVaccines());

    await waitFor(() => expect(result.current.records).toHaveLength(2));

    expect(result.current.records[0]).toMatchObject({
      id: 'soon-vaccine',
      petId: 'pet-1',
      vaccineName: 'Antirrábica',
      batchNumber: 'LOT-001',
      lotNumber: 'LOT-001',
      dose: '1 ml',
      vetId: 'vet-1',
      notes: 'Aplicación sin novedad',
    });

    expect(result.current.getUpcomingVaccines().map((record) => record.id)).toEqual(['soon-vaccine']);
  });

  it('registra una vacuna aplicada consumiendo el servicio del backend', async () => {
    const { result } = renderHook(() => useVaccines());

    await waitFor(() => expect(vacunaServiceMock.getVacunas).toHaveBeenCalled());

    const newRecord = {
      petId: 'pet-1',
      vaccineName: 'Parvovirus',
      applicationDate: '2026-06-12',
      batchNumber: 'LOT-123',
      lotNumber: 'LOT-123',
      dose: '1 ml',
      expiryDate: '2026-12-31',
      nextBoosterDate: '2027-06-12',
      vetId: 'vet-1',
      notes: 'Inventario descontado',
    };

    await act(async () => {
      await result.current.addRecord(newRecord);
    });

    expect(vacunaServiceMock.createVacuna).toHaveBeenCalledWith(newRecord);
  });
});
