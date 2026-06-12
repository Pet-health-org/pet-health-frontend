import { useState, useEffect } from "react";
import { getVeterinarios } from "../../../services/veterinario.service";
import { AppointmentCalendar } from "../components/AppointmentCalendar";
import { AppointmentForm } from "../components/AppointmentForm";
import { useAppointments } from "../hooks/useAppointments";
import { useOwners } from "../../owners/hooks/useOwners";
import { usePets } from "../../pets/hooks/usePets";
import { useNotify } from "../../../context/NotificationContext";
import { useAuth } from "../../../context/AuthContext";
import { Plus } from "lucide-react";

export function AppointmentsPage() {
  const { appointments, isLoading, addAppointment, updateStatus } =
    useAppointments();
  const { owners } = useOwners();
  const { pets } = usePets();
  const { notify } = useNotify();
  const { user } = useAuth();

  const isVeterinario = user?.rol?.name === "veterinario";
  const canCreate = user?.rol?.name === "admin" || user?.rol?.name === "recepcionista";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedVetId, setSelectedVetId] = useState("all");
  const [veterinarians, setVeterinarians] = useState<any[]>([]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await getVeterinarios();
        setVeterinarians(res.data);
        
        if (isVeterinario) {
           const myVet = res.data.find((v: any) => v.username === user?.username || v.userId === user?.id || v.id === user?.id);
           if (myVet) {
             setSelectedVetId(myVet.id);
           }
        }
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };
    fetchVets();
  }, [isVeterinario, user]);

  const handleAdd = (data?: any) => {
    setInitialFormData(data || null);
    setIsFormOpen(true);
  };

  const handleAddAppointment = async (data: any) => {
    setIsFormOpen(false);
    setInitialFormData(null);
    notify("info", "Guardando cita", "Estamos confirmando el agendamiento.");

    const result = await addAppointment(data);
    if (result.success) {
      notify("success", "Éxito", "Cita agendada correctamente");
    } else {
      setInitialFormData(data);
      setIsFormOpen(true);
      notify("error", "Error", result.message || "No se pudo agendar la cita.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Agenda de Citas</h1>
          <p className="text-slate-500">
            Gestión de consultas y disponibilidad de veterinarios.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canCreate && (
            <button
              onClick={() => handleAdd()}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0A2540]/10"
            >
              <Plus size={20} />
              Agendar Cita
            </button>
          )}
        </div>
      </div>

      <AppointmentCalendar
        appointments={appointments}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedVetId={selectedVetId}
        onVetChange={setSelectedVetId}
        veterinarians={veterinarians}
        onAddClick={canCreate ? handleAdd : () => {}}
        canCreate={canCreate}
        isVeterinario={isVeterinario}
      />

      {isFormOpen && (
        <AppointmentForm
          owners={owners}
          pets={pets}
          veterinarians={veterinarians}
          appointments={appointments}
          initialData={initialFormData}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddAppointment}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
}
// Note: Keeping it simple for now, prioritizing core functionality over exhaustive UI variations.
