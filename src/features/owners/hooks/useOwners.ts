import { useState, useCallback, useEffect } from 'react';
import { findAll, create, update, remove } from '../../../services/propietario.service';
import { Owner } from '../types';

export function useOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOwners = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await findAll();
      const mappedOwners: Owner[] = response.data.map((user: any) => {
        // Split nombreCompleto into firstName and lastName if possible
        const nameParts = (user.nombreCompleto || '').split(' ');
        const firstName = nameParts[0] || user.username || 'Sin nombre';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        return {
          id: user.id,
          firstName: firstName,
          lastName: lastName,
          identification: user.numeroIdentificacion || 'N/A',
          email: user.email,
          phone: user.telefono || 'N/A',
          address: user.direccion || 'N/A',
          registrationDate: user.createdAt,
        };
      });
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
      // Prepare data for CreatePropietarioDto
      await create({
        username: ownerData.email.split('@')[0], // Generate username from email
        email: ownerData.email,
        password: 'Password123!', // Default password
        nombreCompleto: `${ownerData.firstName} ${ownerData.lastName}`.trim(),
        numeroIdentificacion: ownerData.identification,
        telefono: ownerData.phone,
        direccion: ownerData.address,
        notas: (ownerData as any).notes // include notes if present
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
      // Prepare data for UpdatePropietarioDto
      const payload: any = {};
      if (ownerData.firstName || ownerData.lastName) {
        payload.nombreCompleto = `${ownerData.firstName || ''} ${ownerData.lastName || ''}`.trim();
      }
      if (ownerData.identification) payload.numeroIdentificacion = ownerData.identification;
      if (ownerData.phone) payload.telefono = ownerData.phone;
      if (ownerData.address) payload.direccion = ownerData.address;
      if ((ownerData as any).notes) payload.notas = (ownerData as any).notes;

      await update(id, payload);
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
      await remove(id);
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
