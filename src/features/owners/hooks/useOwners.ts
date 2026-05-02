import { useState, useCallback, useEffect } from 'react';
import api from '../../../services/api';
import { Owner } from '../types';

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOwners = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/propietarios');
      // Map backend users to frontend owners
      const mappedOwners: Owner[] = response.data.map((user: any) => ({
        id: user.id,
        firstName: user.username, // Using username as name since backend is simple
        lastName: '',
        identification: 'N/A',
        email: user.email,
        phone: 'N/A',
        address: 'N/A',
        registrationDate: user.createdAt,
      }));
      setOwners(mappedOwners);
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const addOwner = useCallback(async (ownerData: Omit<Owner, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    try {
      await api.post('/users', {
        username: ownerData.firstName,
        email: ownerData.email,
        password: 'Password123!', // Default password for new owners
        rolId: 'propietario'
      });
      await fetchOwners();
    } catch (error) {
      console.error('Error adding owner:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOwners]);

  const updateOwner = useCallback(async (id: string, ownerData: Partial<Owner>) => {
    setIsLoading(true);
    try {
      await api.patch(`/users/${id}`, {
        username: ownerData.firstName,
        email: ownerData.email,
      });
      await fetchOwners();
    } catch (error) {
      console.error('Error updating owner:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOwners]);

  const deleteOwner = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await api.delete(`/users/${id}`);
      setOwners(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      console.error('Error deleting owner:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    owners,
    isLoading,
    addOwner,
    updateOwner,
    deleteOwner,
    refresh: fetchOwners
  };
}
