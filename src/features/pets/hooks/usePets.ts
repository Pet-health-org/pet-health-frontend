import { useState, useCallback, useEffect } from 'react';
import { Pet } from '../types';
import { getMascotas, createMascota, updateMascota as apiUpdateMascota, deleteMascota as apiDeleteMascota, getMascotasByDueno } from '../../../services/mascotas.service';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMascotas();
      const mappedPets: Pet[] = response.data.map((m: any) => ({
        id: m.id,
        ownerId: m.propietarioId,
        name: m.nombre,
        species: m.raza?.especie?.nombre || (m.especie ? m.especie.charAt(0).toUpperCase() + m.especie.slice(1) : 'Desconocido'),
        breed: m.raza?.nombre || 'Personalizada',
        speciesId: m.raza?.especie?.id || '',
        breedId: m.razaId || '',
        birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - (m.edad || 0))).toISOString(),
        sex: m.sexo,
        color: m.color,
        weight: Number(m.peso),
        observations: m.notas || ''
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
      const edad = petData.birthDate 
        ? Math.floor((new Date().getTime() - new Date(petData.birthDate).getTime()) / 31536000000) 
        : 0;

      let especieEnum = 'otro';
      const speciesName = (petData.speciesName || '').toLowerCase();
      if (speciesName.includes('perro') || speciesName.includes('canin')) especieEnum = 'perro';
      else if (speciesName.includes('gato') || speciesName.includes('felin')) especieEnum = 'gato';
      else if (speciesName.includes('ave') || speciesName.includes('pájaro')) especieEnum = 'ave';

      const payload = {
        propietarioId: petData.ownerId,
        razaId: petData.breedId && petData.breedId !== 'otro' ? petData.breedId : null,
        nombre: petData.name,
        especie: especieEnum,
        edad: edad,
        sexo: petData.sex,
        peso: Number(petData.weight),
        color: petData.color || ''
      };

      const response = await createMascota(payload);
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
      const edad = petData.birthDate 
        ? Math.floor((new Date().getTime() - new Date(petData.birthDate).getTime()) / 31536000000) 
        : 0;

      // Map species name to backend enum
      let especieEnum = 'otro';
      const speciesName = (petData.speciesName || '').toLowerCase();
      if (speciesName.includes('perro') || speciesName.includes('canin')) especieEnum = 'perro';
      else if (speciesName.includes('gato') || speciesName.includes('felin')) especieEnum = 'gato';
      else if (speciesName.includes('ave') || speciesName.includes('pájaro')) especieEnum = 'ave';

      const payload = {
        propietarioId: petData.ownerId,
        razaId: petData.breedId && petData.breedId !== 'otro' ? petData.breedId : null,
        nombre: petData.name,
        especie: especieEnum,
        edad: edad,
        sexo: petData.sex,
        peso: Number(petData.weight),
        color: petData.color || ''
      };

      await apiUpdateMascota(id, payload);
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
      await apiDeleteMascota(id);
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
      const response = await getMascotasByDueno(ownerId);
      return response.data;
    } catch (error) {
      console.error('Error fetching pets by owner:', error);
      return [];
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
