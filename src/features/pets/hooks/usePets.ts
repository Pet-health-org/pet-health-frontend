import { useState, useCallback, useEffect } from 'react';
import { Pet } from '../types';
import { getMascotas, createMascota, updateMascota as apiUpdateMascota, deleteMascota as apiDeleteMascota, getMascotasByDueno } from '../../../services/api';

export function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMascotas();
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const addPet = useCallback(async (petData: Omit<Pet, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    try {
      await createMascota(petData);
      await fetchPets();
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPets]);

  const updatePet = useCallback(async (id: string, petData: Partial<Pet>) => {
    setIsLoading(true);
    try {
      await apiUpdateMascota(id, petData);
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
