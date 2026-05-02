export interface VitalSigns {
  weight: number;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
}

export interface Consultation {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  reason: string;
  anamnesis: string;
  physicalExam: string;
  vitals: VitalSigns;
  diagnosis: string;
  treatment: string;
  observations?: string;
  registrationDate: string;
}

export interface VitalStatus {
  value: number;
  status: 'normal' | 'abnormal' | 'critical';
  range: { min: number; max: number };
}
// Note: We use the SPECIES_VITAL_RANGES from pets/types for validation.
