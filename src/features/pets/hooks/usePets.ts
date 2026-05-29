import { useState, useCallback, useEffect } from 'react';
import { Pet } from '../types';
import { findAll, create, update, remove, findByPropietario } from '../../../services/mascota.service';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findAll();
      const mappedPets: Pet[] = response.data.map((p: any) => ({
        id: p.id,
        name: p.nombre,
        speciesId: p.especieId,
        species: p.especie?.nombre || 'Desconocida',
        breedId: p.razaId,
        breed: p.raza?.nombre || 'Desconocida',
        ownerId: p.propietarioId,
        birthDate: p.fechaNacimiento,
        sex: p.sexo,
        color: p.color,
        weight: p.peso,
        registrationDate: p.createdAt
      }));
      setPets(mappedPets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = useCallback(async (petData: any) => {
    setIsLoading(true);
    try {
      const payload = {
        nombre: petData.name,
        especieId: petData.speciesId === 'otro' ? undefined : petData.speciesId,
        razaId: petData.breedId === 'otro' ? undefined : petData.breedId,
        fechaNacimiento: new Date(petData.birthDate).toISOString(),
        sexo: petData.sex,
        color: petData.color,
        peso: petData.weight,
        propietarioId: petData.ownerId,
      };
      const response = await create(payload);
      await fetchPets();
      return response.data;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPets]);

  const updatePet = useCallback(async (id: string, petData: any) => {
    setIsLoading(true);
    try {
      const payload: any = {};
      if (petData.name) payload.nombre = petData.name;
      if (petData.breedId && petData.breedId !== 'otro') payload.razaId = petData.breedId;
      if (petData.sex) payload.sexo = petData.sex;
      if (petData.color) payload.color = petData.color;
      if (petData.weight !== undefined) payload.peso = petData.weight;
      if (petData.ownerId) payload.propietarioId = petData.ownerId;

      await update(id, payload);
      await fetchPets();
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPets]);

  const deletePet = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await remove(id);
      setPets(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPetsByOwner = async (ownerId: string) => {
    try {
      let response;
      if (ownerId) {
        response = await findByPropietario(ownerId);
      } else {
        response = await findAll();
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching pets by owner:', error);
      throw error;
    }
  };

  return {
    pets,
    isLoading,
    addPet,
    updatePet,
    deletePet,
    getPetsByOwner,
    refresh: fetchPets
  };
}
