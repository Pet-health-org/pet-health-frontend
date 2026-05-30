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
      const mappedPets: Pet[] = response.data.map((p: any) => {
        // Generar un birthDate aproximado basado en la edad para que el UI funcione
        const birthDate = p.birthDate || new Date(new Date().setFullYear(new Date().getFullYear() - (p.edad || 0))).toISOString().split('T')[0];

        // Capitalize especie para que los íconos de la UI (PetList) coincidan ('Perro', 'Gato', etc)
        const especieName = p.especie ? p.especie.charAt(0).toUpperCase() + p.especie.slice(1) : 'Desconocida';

        return {
          id: p.id,
          name: p.nombre,
          speciesId: p.raza?.especie?.id || '',
          species: especieName,
          breedId: p.razaId,
          breed: p.raza?.nombre || 'Desconocida',
          ownerId: p.propietarioId,
          birthDate: birthDate,
          sex: p.sexo,
          color: p.color,
          weight: p.peso,
          observations: p.observaciones,
          registrationDate: p.createdAt
        };
      });
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
      // Calcular edad a partir del birthDate proporcionado por el formulario
      let edadCalculada = 0;
      if (petData.birthDate) {
        const bd = new Date(petData.birthDate);
        const ageDifMs = Date.now() - bd.getTime();
        const ageDate = new Date(ageDifMs);
        edadCalculada = Math.abs(ageDate.getUTCFullYear() - 1970);
      }

      // Determinar especie enum
      let especieEnum = 'otro';
      if (petData.speciesName) {
        const nameLower = petData.speciesName.toLowerCase();
        if (nameLower.includes('perro') || nameLower.includes('canin')) especieEnum = 'perro';
        else if (nameLower.includes('gato') || nameLower.includes('felin')) especieEnum = 'gato';
        else if (nameLower.includes('ave') || nameLower.includes('pajar')) especieEnum = 'ave';
      }

      const payload = {
        nombre: petData.name,
        especie: especieEnum,
        razaId: petData.breedId === 'otro' ? undefined : petData.breedId,
        birthDate: petData.birthDate,
        sexo: petData.sex,
        color: petData.color || undefined,
        peso: Number(petData.weight) || 0.1,
        propietarioId: petData.ownerId,
        observaciones: petData.observations || undefined,
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
      if (petData.weight !== undefined) payload.peso = Number(petData.weight);
      if (petData.ownerId) payload.propietarioId = petData.ownerId;

      if (petData.birthDate) payload.birthDate = petData.birthDate;
      if (petData.observations) payload.observaciones = petData.observations;

      if (petData.speciesName) {
        const nameLower = petData.speciesName.toLowerCase();
        if (nameLower.includes('perro') || nameLower.includes('canin')) payload.especie = 'perro';
        else if (nameLower.includes('gato') || nameLower.includes('felin')) payload.especie = 'gato';
        else if (nameLower.includes('ave') || nameLower.includes('pajar')) payload.especie = 'ave';
        else payload.especie = 'otro';
      }

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
