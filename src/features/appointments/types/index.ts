export type AppointmentStatus = 'Programada' | 'Completada' | 'Cancelada' | 'Ausente';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  petId: string;
  ownerId: string;
  vetId: string;
  reason: string;
  status: AppointmentStatus;
  durationMinutes: number; // For HU-08
  registrationDate: string;
}

export interface Veterinarian {
  id: string;
  name: string;
  specialty?: string;
  workingHours: {
    start: string;
    end: string;
  };
}

export const MOCK_VETERINARIANS: Veterinarian[] = [
  { id: 'v1', name: 'Dr. Alejandro Martínez', specialty: 'Cirugía', workingHours: { start: '08:00', end: '17:00' } },
  { id: 'v2', name: 'Dra. Elena Rodríguez', specialty: 'Medicina Interna', workingHours: { start: '09:00', end: '18:00' } },
  { id: 'v3', name: 'Dr. Roberto Sánchez', specialty: 'Dermatología', workingHours: { start: '08:00', end: '16:00' } },
];
