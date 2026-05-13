import { useState, useCallback, useEffect } from 'react';
import { Appointment } from '../types';
import { getCitas, createCita, updateCita as apiUpdateCita, deleteCita as apiDeleteCita } from '../../../services/citas.service';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCitas();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const checkConflict = useCallback((vetId: string, date: string, time: string, duration: number) => {
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

  const addAppointment = useCallback(async (data: Omit<Appointment, 'id' | 'registrationDate' | 'status'>) => {
    setIsLoading(true);
    
    if (checkConflict(data.vetId, data.date, data.time, data.durationMinutes)) {
      setIsLoading(false);
      return { success: false, message: 'El veterinario tiene un conflicto de horario.' };
    }

    try {
      await createCita({ ...data, status: 'Programada' });
      await fetchAppointments();
      return { success: true };
    } catch (error) {
      console.error('Error adding appointment:', error);
      setIsLoading(false);
      return { success: false, message: 'Error al crear la cita.' };
    }
  }, [checkConflict, fetchAppointments]);

  const updateStatus = useCallback(async (id: string, status: Appointment['status']) => {
    setIsLoading(true);
    try {
      await apiUpdateCita(id, { status });
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  const updateAppointment = useCallback(async (id: string, data: any) => {
    setIsLoading(true);
    try {
      await apiUpdateCita(id, data);
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiDeleteCita(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    isLoading,
    addAppointment,
    updateStatus,
    checkConflict,
    updateAppointment,
    cancelAppointment,
    refresh: fetchAppointments
  };
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}
