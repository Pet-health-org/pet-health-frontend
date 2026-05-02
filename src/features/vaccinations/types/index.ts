export interface VaccinationRecord {
  id: string;
  petId: string;
  vaccineName: string;
  applicationDate: string;
  batchNumber: string;
  expiryDate: string;
  nextBoosterDate: string;
  vetId: string;
  notes?: string;
}

export interface VaccineScheme {
  species: 'Perro' | 'Gato' | 'Ave' | 'Otros';
  vaccines: {
    name: string;
    description: string;
    recommendedAgeWeeks: number;
    isMandatory: boolean;
    boosterIntervalMonths: number;
  }[];
}

export const VACCINE_SCHEMES: VaccineScheme[] = [
  {
    species: 'Perro',
    vaccines: [
      { name: 'Parvovirus', description: 'Prevención de parvovirosis', recommendedAgeWeeks: 6, isMandatory: true, boosterIntervalMonths: 12 },
      { name: 'Triple Viral', description: 'Moquillo, Hepatitis y Leptospira', recommendedAgeWeeks: 9, isMandatory: true, boosterIntervalMonths: 12 },
      { name: 'Antirrábica', description: 'Prevención de Rabia', recommendedAgeWeeks: 12, isMandatory: true, boosterIntervalMonths: 12 },
    ]
  },
  {
    species: 'Gato',
    vaccines: [
      { name: 'Triple Felina', description: 'Calicivirus, Rinotraqueitis y Panleucopenia', recommendedAgeWeeks: 8, isMandatory: true, boosterIntervalMonths: 12 },
      { name: 'Leucemia Felina', description: 'Prevención de Leucemia', recommendedAgeWeeks: 12, isMandatory: true, boosterIntervalMonths: 12 },
      { name: 'Antirrábica', description: 'Prevención de Rabia', recommendedAgeWeeks: 16, isMandatory: true, boosterIntervalMonths: 12 },
    ]
  }
];
// Note: HU-14 requires configuring these schemes.
// HU-15 requires alerting with 15 days of anticipation.
export const ALERT_DAYS_THRESHOLD = 15;
