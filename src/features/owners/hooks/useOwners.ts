import { useState, useCallback } from 'react';
import { Owner } from '../types';

// Mock initial data
const initialOwners: Owner[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    identification: '12345678',
    email: 'juan.perez@example.com',
    phone: '555-0123',
    address: 'Calle Falsa 123, Ciudad',
    registrationDate: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'Gómez',
    identification: '87654321',
    email: 'maria.gomez@example.com',
    phone: '555-0124',
    address: 'Avenida Siempre Viva 742, Ciudad',
    registrationDate: '2023-02-20T14:30:00Z'
  }
];

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [isLoading, setIsLoading] = useState(false);

  const addOwner = useCallback((ownerData: Omit<Owner, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newOwner: Owner = {
        ...ownerData,
        id: Math.random().toString(36).substr(2, 9),
        registrationDate: new Date().toISOString(),
      };
      setOwners(prev => [newOwner, ...prev]);
      setIsLoading(false);
    }, 500);
  }, []);

  const updateOwner = useCallback((id: string, ownerData: Partial<Owner>) => {
    setIsLoading(true);
    setTimeout(() => {
      setOwners(prev => prev.map(o => o.id === id ? { ...o, ...ownerData } : o));
      setIsLoading(false);
    }, 500);
  }, []);

  const deleteOwner = useCallback((id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setOwners(prev => prev.filter(o => o.id !== id));
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    owners,
    isLoading,
    addOwner,
    updateOwner,
    deleteOwner
  };
}
