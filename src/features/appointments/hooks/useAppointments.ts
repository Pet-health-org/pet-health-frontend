import { useState, useCallback } from 'react';
import { Appointment } from '../types';

const initialAppointments: Appointment[] = [];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isLoading, setIsLoading] = useState(false);

  const checkConflict = useCallback((vetId: string, date: string, time: string, duration: number) => {
    // Basic conflict check: same vet, same date, overlapping time
    return appointments.some(app => {
      if (app.vetId !== vetId || app.date !== date || app.status === 'Cancelada') return false;
      
      const appStartTime = app.time;
      const appEndTime = addMinutesToTime(app.time, app.durationMinutes);
      const newStartTime = time;
      const newEndTime = addMinutesToTime(time, duration);
      
      return (newStartTime >= appStartTime && newStartTime < appEndTime) ||
             (newEndTime > appStartTime && newEndTime <= appEndTime);
    });
  }, [appointments]);

  const addAppointment = useCallback((data: Omit<Appointment, 'id' | 'registrationDate' | 'status'>) => {
    setIsLoading(true);
    
    // Simulate conflict validation
    if (checkConflict(data.vetId, data.date, data.time, data.durationMinutes)) {
      setIsLoading(false);
      return { success: false, message: 'El veterinario tiene un conflicto de horario.' };
    }

    setTimeout(() => {
      const newApp: Appointment = {
        ...data,
        id: 'a' + Math.random().toString(36).substr(2, 5),
        status: 'Programada',
        registrationDate: new Date().toISOString(),
      };
      setAppointments(prev => [...prev, newApp]);
      setIsLoading(false);
    }, 500);
    
    return { success: true };
  }, [checkConflict]);

  const updateStatus = useCallback((id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  const updateAppointment = useCallback((id: string, data: any) => {
    // Stub
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    // Stub
  }, []);

  return {
    appointments,
    isLoading,
    addAppointment,
    updateStatus,
    checkConflict,
    updateAppointment,
    cancelAppointment
  };
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}
