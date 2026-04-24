import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Appointment, Veterinarian, MOCK_VETERINARIANS } from '../types';
import { Owner } from '../../owners/types';
import { Pet } from '../../pets/types';

interface AppointmentFormProps {
  owners: Owner[];
  pets: Pet[];
  onClose: () => void;
  onSubmit: (data: Omit<Appointment, 'id' | 'registrationDate' | 'status'>) => { success: boolean; message?: string };
  isSubmitting?: boolean;
}

export function AppointmentForm({ owners, pets, onClose, onSubmit, isSubmitting }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    ownerId: '',
    petId: '',
    vetId: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    reason: '',
    durationMinutes: 30
  });

  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.ownerId) {
      setFilteredPets(pets.filter(p => p.ownerId === formData.ownerId));
    } else {
      setFilteredPets([]);
    }
  }, [formData.ownerId, pets]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerId) newErrors.ownerId = 'Debe seleccionar un propietario';
    if (!formData.petId) newErrors.petId = 'Debe seleccionar una mascota';
    if (!formData.vetId) newErrors.vetId = 'Debe seleccionar un veterinario';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    if (!formData.time) newErrors.time = 'La hora es obligatoria';
    if (!formData.reason) newErrors.reason = 'El motivo es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (validate()) {
      const result = onSubmit(formData);
      if (!result.success) {
        setServerError(result.message || 'Error al agendar la cita');
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">Agendar Nueva Cita</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{serverError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Propietario *</label>
              <select 
                className={`w-full px-4 py-2 border ${errors.ownerId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.ownerId}
                onChange={(e) => setFormData({...formData, ownerId: e.target.value, petId: ''})}
              >
                <option value="">Seleccione un propietario...</option>
                {owners.map(o => (
                  <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Mascota *</label>
              <select 
                className={`w-full px-4 py-2 border ${errors.petId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.petId}
                onChange={(e) => setFormData({...formData, petId: e.target.value})}
                disabled={!formData.ownerId}
              >
                <option value="">{formData.ownerId ? 'Seleccione mascota...' : 'Primero elija un dueño'}</option>
                {filteredPets.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Veterinario Asignado *</label>
              <select 
                className={`w-full px-4 py-2 border ${errors.vetId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.vetId}
                onChange={(e) => setFormData({...formData, vetId: e.target.value})}
              >
                <option value="">Seleccione veterinario...</option>
                {MOCK_VETERINARIANS.map(v => (
                  <option key={v.id} value={v.id}>{v.name} - {v.specialty}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha *</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border ${errors.date ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Hora *</label>
              <input 
                type="time" 
                className={`w-full px-4 py-2 border ${errors.time ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Motivo de Consulta *</label>
              <textarea 
                className={`w-full px-4 py-2 border ${errors.reason ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all min-h-[80px]`}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="Ej: Vacunación anual, cojera en pata trasera..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 disabled:opacity-70 flex items-center gap-2">
              {isSubmitting ? 'Agendando...' : 'Confirmar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
