import { Clock, User } from 'lucide-react';
import { Appointment, Veterinarian, MOCK_VETERINARIANS } from '../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedVetId: string;
  onVetChange: (id: string) => void;
}

export function AppointmentCalendar({ appointments, selectedDate, onDateChange, selectedVetId, onVetChange }: AppointmentCalendarProps) {
  const timeSlots = generateTimeSlots('08:00', '18:00', 30);

  const getAppointmentAt = (time: string) => {
    return appointments.find(a => 
      a.date === selectedDate && 
      (selectedVetId === 'all' || a.vetId === selectedVetId) &&
      a.time === time
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
            value={selectedVetId}
            onChange={(e) => onVetChange(e.target.value)}
          >
            <option value="all">Todos los veterinarios</option>
            {MOCK_VETERINARIANS.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-white border border-slate-300 rounded"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Ocupado</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {timeSlots.map(time => {
            const app = getAppointmentAt(time);
            return (
              <div 
                key={time}
                className={`p-3 rounded-xl border transition-all ${
                  app 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-[#A8DADC] hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                    <Clock size={14} className="text-slate-400" />
                    {time}
                  </div>
                  {app && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded font-bold uppercase">
                      Ocupado
                    </span>
                  )}
                </div>
                
                {app ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#0A2540] truncate">Mascota: {app.petId}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <User size={10} />
                      <span className="truncate">{MOCK_VETERINARIANS.find(v => v.id === app.vetId)?.name}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Horario disponible</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function generateTimeSlots(start: string, end: string, stepMinutes: number): string[] {
  const slots: string[] = [];
  let current = start;
  while (current <= end) {
    slots.push(current);
    const [h, m] = current.split(':').map(Number);
    const total = h * 60 + m + stepMinutes;
    const nextH = Math.floor(total / 60);
    const nextM = total % 60;
    current = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;
  }
  return slots;
}
// Note: In the final version, I'd resolve pet/vet names properly
