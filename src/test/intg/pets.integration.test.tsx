import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mascotaServiceMock = vi.hoisted(() => ({
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  findByPropietario: vi.fn(),
}));

vi.mock('../../services/mascota.service', () => mascotaServiceMock);

import { usePets } from '../../features/pets/hooks/usePets';

describe('Integración frontend - mascotas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mascotaServiceMock.findAll.mockResolvedValue({ data: [] });
    mascotaServiceMock.create.mockResolvedValue({ data: { id: 'pet-1' } });
    mascotaServiceMock.update.mockResolvedValue({ data: { id: 'pet-1' } });
  });

  it('registra una mascota con el contrato esperado por el backend', async () => {
    const { result } = renderHook(() => usePets());

    await waitFor(() => expect(mascotaServiceMock.findAll).toHaveBeenCalled());

    await act(async () => {
      await result.current.addPet({
        name: 'Luna',
        speciesName: 'Perro',
        breedId: '550e8400-e29b-41d4-a716-446655440000',
        birthDate: '2022-03-15',
        sex: 'Hembra',
        color: 'Blanco',
        weight: 8.5,
        ownerId: '550e8400-e29b-41d4-a716-446655440001',
        observations: 'Paciente esterilizada',
      });
    });

    expect(mascotaServiceMock.create).toHaveBeenCalledWith({
      nombre: 'Luna',
      especie: 'perro',
      razaId: '550e8400-e29b-41d4-a716-446655440000',
      birthDate: '2022-03-15',
      sexo: 'Hembra',
      color: 'Blanco',
      peso: 8.5,
      propietarioId: '550e8400-e29b-41d4-a716-446655440001',
      observaciones: 'Paciente esterilizada',
    });

    expect(mascotaServiceMock.create.mock.calls[0][0]).not.toHaveProperty('edad');
  });

  it('mapea correctamente la respuesta del backend hacia el modelo del frontend', async () => {
    mascotaServiceMock.findAll.mockResolvedValue({
      data: [
        {
          id: 'pet-1',
          nombre: 'Milo',
          especie: 'gato',
          razaId: 'breed-1',
          raza: { nombre: 'Criollo' },
          propietarioId: 'owner-1',
          birthDate: '2021-01-10',
          sexo: 'Macho',
          color: 'Gris',
          peso: 4.2,
          observaciones: 'Alérgico a penicilina',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });

    const { result } = renderHook(() => usePets());

    await waitFor(() => expect(result.current.pets).toHaveLength(1));

    expect(result.current.pets[0]).toMatchObject({
      id: 'pet-1',
      name: 'Milo',
      species: 'Gato',
      breed: 'Criollo',
      ownerId: 'owner-1',
      birthDate: '2021-01-10',
      observations: 'Alérgico a penicilina',
    });
  });
});
