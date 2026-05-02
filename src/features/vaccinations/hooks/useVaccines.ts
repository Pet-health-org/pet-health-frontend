import { useState, useCallback, useEffect } from 'react';
import { VaccinationRecord, ALERT_DAYS_THRESHOLD } from '../types';
import { getVacunas, createVacuna, getVacunasByHistoriaClinica } from '../../../services/api';

export function useVaccines() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVaccines = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getVacunas();
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccines();
  }, [fetchVaccines]);

  const addRecord = useCallback(async (data: Omit<VaccinationRecord, 'id'>) => {
    setIsLoading(true);
    try {
      await createVacuna(data);
      await fetchVaccines();
    } catch (error) {
      console.error('Error adding vaccine:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchVaccines]);

  const getUpcomingVaccines = useCallback(() => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + ALERT_DAYS_THRESHOLD);

    return records.filter(r => {
      const boosterDate = new Date(r.nextBoosterDate);
      return boosterDate >= today && boosterDate <= thresholdDate;
    });
  }, [records]);

  const getPetVaccinations = async (historiaId: string) => {
    try {
      const response = await getVacunasByHistoriaClinica(historiaId);
      return response.data;
    } catch (error) {
      console.error('Error fetching pet vaccinations:', error);
      return [];
    }
  };

  return {
    records,
    isLoading,
    addRecord,
    getUpcomingVaccines,
    getPetVaccinations,
    refresh: fetchVaccines
  };
}
