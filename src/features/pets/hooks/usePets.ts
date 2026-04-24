import { useState, useCallback } from 'react';
import { Pet } from '../types';

const initialPets: Pet[] = [
  {
    id: 'p1',
    ownerId: '1',
    name: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    birthDate: '2021-05-10',
    sex: 'Macho',
    color: 'Dorado',
    weight: 30,
    registrationDate: '2023-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    ownerId: '2',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    birthDate: '2022-02-20',
    sex: 'Hembra',
    color: 'Blanco/Gris',
    weight: 4.5,
    registrationDate: '2023-02-20T14:30:00Z'
  }
];

export function usePets() {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [isLoading, setIsLoading] = useState(false);

  const addPet = useCallback((petData: Omit<Pet, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newPet: Pet = {
        ...petData,
        id: 'p' + Math.random().toString(36).substr(2, 5),
        registrationDate: new Date().toISOString(),
      };
      setPets(prev => [newPet, ...prev]);
      setIsLoading(false);
    }, 500);
  }, []);

  const updatePet = useCallback((id: string, petData: Partial<Pet>) => {
    setIsLoading(true);
    setTimeout(() => {
      setOwners(prev => prev.map(p => p.id === id ? { ...p, ...petData } : p));
      setIsLoading(false);
    }, 500);
  }, []);

  const deletePet = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setPets(prev => prev.filter(p => p.id !== id));
      setIsLoading(false);
    }, 500);
  }, []);

  const getPetsByOwner = (ownerId: string) => {
    return pets.filter(p => p.ownerId === ownerId);
  };

  return {
    pets,
    isLoading,
    addPet,
    updatePet,
    deletePet,
    getPetsByOwner
  };
}
// Note: Fixed a small typo in updatePet (setOwners -> setPets) during implementation
