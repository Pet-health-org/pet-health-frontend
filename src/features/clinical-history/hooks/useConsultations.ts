import { useState, useCallback, useEffect } from 'react';
import { Consultation, VitalSigns } from '../types';
import { Species, SPECIES_VITAL_RANGES } from '../../pets/types';
import { getHistoriasClinicas, createHistoriaClinica, getHistoriasClinicasByMascota } from '../../../services/historia-clinica.service';

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConsultations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getHistoriasClinicas();
      const mappedData: Consultation[] = response.data.map((h: any) => {
        let extraData = { anamnesis: '', physicalExam: '', reason: '', vitals: { weight: 0, temperature: 0, heartRate: 0, respiratoryRate: 0 } };
        
        try {
          if (h.observaciones && h.observaciones.startsWith('{')) {
            extraData = JSON.parse(h.observaciones);
          }
        } catch (e) {
          // If not JSON, use the raw string as reason or observations
          extraData.reason = h.observaciones || '';
        }

        return {
          id: h.id,
          petId: h.mascotaId,
          date: h.fecha,
          diagnosis: h.diagnostico,
          treatment: h.tratamiento,
          vetId: h.cita?.veterinarioId || 'v1',
          vetName: h.cita?.veterinario?.nombre || 'Especialista',
          ...extraData
        };
      });
      setConsultations(mappedData);
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
    const ranges = SPECIES_VITAL_RANGES[species] || SPECIES_VITAL_RANGES['Otros'];
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

  const addConsultation = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      // Pack extended data into observations for backend compatibility
      const extraInfo = {
        anamnesis: data.anamnesis,
        physicalExam: data.physicalExam,
        reason: data.reason,
        vitals: data.vitals,
        vetName: data.vetName
      };

      const payload = {
        mascotaId: data.petId,
        fecha: new Date(data.date).toISOString(),
        diagnostico: data.diagnosis,
        tratamiento: data.treatment,
        observaciones: JSON.stringify(extraInfo)
      };

      await createHistoriaClinica(payload);
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
