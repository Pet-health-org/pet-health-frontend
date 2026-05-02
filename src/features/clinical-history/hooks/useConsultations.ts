import { useState, useCallback, useEffect } from 'react';
import { Consultation, VitalSigns } from '../types';
import { Species, SPECIES_VITAL_RANGES } from '../../pets/types';
import { getHistoriasClinicas, createHistoriaClinica, getHistoriasClinicasByMascota } from '../../../services/api';

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getHistoriasClinicas();
      setConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

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

  const addConsultation = useCallback(async (data: Omit<Consultation, 'id' | 'registrationDate'>) => {
    setIsLoading(true);
    try {
      await createHistoriaClinica(data);
      await fetchConsultations();
    } catch (error) {
      console.error('Error adding consultation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchConsultations]);

  const getPetHistory = (petId: string) => {
    return consultations
      .filter(c => c.petId === petId)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    consultations,
    isLoading,
    addConsultation,
    getPetHistory,
    validateVitals,
    refresh: fetchConsultations
  };
}
