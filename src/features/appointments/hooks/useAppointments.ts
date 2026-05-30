import { useState, useCallback, useEffect } from "react";
import { Appointment } from "../types";
import {
  getCitas,
  createCita,
  updateCita as apiUpdateCita,
  deleteCita as apiDeleteCita,
} from "../../../services/cita.service";

function mapCitaToAppointment(a: any): Appointment {
  const dateObj = new Date(a.fechaHora);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return {
    id: a.id,
    petId: a.mascotaId,
    vetId: a.veterinarioId,
    ownerId: a.mascota?.propietarioId || "",
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
    reason: a.motivo,
    status: a.estado === "pendiente" ? "Programada" : a.estado || "Programada",
    durationMinutes: 30,
    registrationDate: a.createdAt || new Date().toISOString(),
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCitas();
      setAppointments(response.data.map(mapCitaToAppointment));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const checkConflict = useCallback(
    (vetId: string, date: string, time: string, duration: number) => {
      return appointments.some((app) => {
        if (
          app.vetId !== vetId ||
          app.date !== date ||
          app.status === "Cancelada"
        )
          return false;

        const appStartTime = app.time;
        const appEndTime = addMinutesToTime(app.time, app.durationMinutes);
        const newStartTime = time;
        const newEndTime = addMinutesToTime(time, duration);

        return (
          (newStartTime >= appStartTime && newStartTime < appEndTime) ||
          (newEndTime > appStartTime && newEndTime <= appEndTime)
        );
      });
    },
    [appointments],
  );

  const addAppointment = useCallback(
    async (data: any) => {
      setIsLoading(true);

      if (
        checkConflict(data.vetId, data.date, data.time, data.durationMinutes)
      ) {
        setIsLoading(false);
        return {
          success: false,
          message: "El veterinario tiene un conflicto de horario.",
        };
      }

      try {
        const payload = {
          mascotaId: data.petId,
          veterinarioId: data.vetId,
          fechaHora: new Date(`${data.date}T${data.time}:00`).toISOString(),
          motivo: data.reason,
          estado: "pendiente",
        };

        const response = await createCita(payload);
        const created = response.data?.fechaHora
          ? mapCitaToAppointment(response.data)
          : {
              id: Math.random().toString(36).slice(2),
              petId: data.petId,
              vetId: data.vetId,
              ownerId: data.ownerId || "",
              date: data.date,
              time: data.time,
              reason: data.reason,
              status: "Programada" as const,
              durationMinutes: data.durationMinutes || 30,
              registrationDate: new Date().toISOString(),
            };

        setAppointments((prev) => [created, ...prev]);
        setIsLoading(false);
        void fetchAppointments();
        return { success: true };
      } catch (error: any) {
        console.error("Error adding appointment:", error);
        setIsLoading(false);
        return {
          success: false,
          message:
            error.response?.data?.message ||
            "Error al crear la cita en el servidor.",
        };
      }
    },
    [checkConflict, fetchAppointments],
  );

  const updateStatus = useCallback(
    async (id: string, status: Appointment["status"]) => {
      setIsLoading(true);
      try {
        const estado = status === "Programada" ? "pendiente" : status;
        await apiUpdateCita(id, { estado });
        await fetchAppointments();
      } catch (error) {
        console.error("Error updating status:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAppointments],
  );

  const updateAppointment = useCallback(
    async (id: string, data: any) => {
      setIsLoading(true);
      try {
        await apiUpdateCita(id, data);
        await fetchAppointments();
      } catch (error) {
        console.error("Error updating appointment:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAppointments],
  );

  const cancelAppointment = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await apiDeleteCita(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error cancelling appointment:", error);
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
    refresh: fetchAppointments,
  };
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMins = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMins / 60);
  const newMins = totalMins % 60;
  return `${newHours.toString().padStart(2, "0")}:${newMins.toString().padStart(2, "0")}`;
}
