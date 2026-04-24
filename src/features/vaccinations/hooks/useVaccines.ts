import { useState, useCallback } from 'react';
import { VaccinationRecord, ALERT_DAYS_THRESHOLD } from '../types';

export function useVaccines() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addRecord = useCallback((data: Omit<VaccinationRecord, 'id'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newRecord: VaccinationRecord = {
        ...data,
        id: 'v' + Math.random().toString(36).substr(2, 5),
      };
      setRecords(prev => [newRecord, ...prev]);
      setIsLoading(false);
    }, 500);
  }, []);

  const getUpcomingVaccines = useCallback(() => {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + ALERT_DAYS_THRESHOLD);

    return records.filter(r => {
      const boosterDate = new Date(r.nextBoosterDate);
      return boosterDate >= today && boosterDate <= thresholdDate;
    });
  }, [records]);

  const getPetVaccinations = (petId: string) => {
    return records.filter(r => r.petId === petId);
  };

  return {
    records,
    isLoading,
    addRecord,
    getUpcomingVaccines,
    getPetVaccinations
  };
}
