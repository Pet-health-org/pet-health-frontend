export type Species = 'Perro' | 'Gato' | 'Ave' | 'Otros';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string;
  sex: 'Macho' | 'Hembra';
  color: string;
  weight: number;
  observations?: string;
  registrationDate: string;
}

export interface VitalRanges {
  temperature: { min: number; max: number };
  heartRate: { min: number; max: number };
  respiratoryRate: { min: number; max: number };
}

export const SPECIES_VITAL_RANGES: Record<Species, VitalRanges> = {
  'Perro': {
    temperature: { min: 37.5, max: 39.2 },
    heartRate: { min: 70, max: 120 },
    respiratoryRate: { min: 10, max: 30 }
  },
  'Gato': {
    temperature: { min: 38.0, max: 39.2 },
    heartRate: { min: 140, max: 220 },
    respiratoryRate: { min: 20, max: 42 }
  },
  'Ave': {
    temperature: { min: 39.0, max: 42.0 },
    heartRate: { min: 150, max: 350 },
    respiratoryRate: { min: 15, max: 50 }
  },
  'Otros': {
    temperature: { min: 35.0, max: 40.0 },
    heartRate: { min: 60, max: 400 },
    respiratoryRate: { min: 10, max: 60 }
  }
};
