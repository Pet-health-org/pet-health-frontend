import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { AppointmentCalendar } from '../components/AppointmentCalendar';
import { AppointmentForm } from '../components/AppointmentForm';
import { useAppointments } from '../hooks/useAppointments';
import { useOwners } from '../../owners/hooks/useOwners';
import { usePets } from '../../pets/hooks/usePets';
import { useNotify } from '../../../context/NotificationContext';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

export function AppointmentsPage() {
  const { appointments, isLoading, addAppointment, updateStatus } = useAppointments();
  const { owners } = useOwners();
  const { pets } = usePets();
  const { notify } = useNotify();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedVetId, setSelectedVetId] = useState('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [veterinarians, setVeterinarians] = useState<any[]>([]);

  useEffect(() => {
    const fetchVets = async () => {
      try {
        const res = await api.get('/veterinarios');
        setVeterinarians(res.data);
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
      }
    };
    fetchVets();
  }, []);

  const handleAdd = () => {
    setIsFormOpen(true);
  };

  const handleAddAppointment = (data: any) => {
    const result = addAppointment(data);
    if (result.success) {
      notify('success', 'Cita Agendada', 'La consulta ha sido programada correctamente.');
    }
    return result;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert 
        moduleName="Citas" 
        title="Módulo Funcional con Ajustes Pendientes"
        customMessage="La asignación de veterinarios ya está vinculada a la base de datos real. Próximamente se integrarán los endpoints para guardar las citas programadas de forma persistente."
        variant="info"
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Agenda de Citas</h1>
          <p className="text-slate-500">Gestión de consultas y disponibilidad de veterinarios.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-slate-100 text-[#0A2540]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-100 text-[#0A2540]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
          </div>
          <button 
            onClick={handleAdd}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0A2540]/10"
          >
            <Plus size={20} />
            Agendar Cita
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar 
          appointments={appointments}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedVetId={selectedVetId}
          onVetChange={setSelectedVetId}
          veterinarians={veterinarians}
        />
      ) : (
        <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
          Vista de lista en desarrollo (Próxima actualización)
        </div>
      )}

      {isFormOpen && (
        <AppointmentForm 
          owners={owners}
          pets={pets}
          veterinarians={veterinarians}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddAppointment}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
}
// Note: Keeping it simple for now, prioritizing core functionality over exhaustive UI variations.
