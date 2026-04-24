import { useState, useCallback } from 'react';
import { Consultation, VitalSigns } from '../types';
import { Species, SPECIES_VITAL_RANGES } from '../../pets/types';

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateVitals = useCallback((species: Species, vitals: VitalSigns) => {
    const ranges = SPECIES_VITAL_RANGES[species];
    const results = {
      temperature: vitals.temperature < ranges.temperature.min || vitals.temperature > ranges.temperature.max,
      heartRate: vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max,
      respiratoryRate: vitals.respiratoryRate < ranges.respiratoryRate.min || vitals.respiratoryRate > ranges.respiratoryRate.max,
    };
    return {
      isValid: !results.temperature && !results.heartRate && !results.respiratoryRate,
      results
    };
  }, []);

  const addConsultation = useCallback((data: Omit<Consultation, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newConsultation: Consultation = {
        ...data,
        id: 'c' + Math.random().toString(36).substr(2, 5),
        registrationDate: new Date().toISOString(),
      };
      setConsultations(prev => [newConsultation, ...prev]);
      setIsLoading(false);
    }, 500);
  }, []);

  const getPetHistory = (petId: string) => {
    return consultations
      .filter(c => c.petId === petId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    consultations,
    isLoading,
    addConsultation,
    getPetHistory,
    validateVitals
  };
}
