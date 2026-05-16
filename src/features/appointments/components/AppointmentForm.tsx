import React, { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, Search, Calendar, Clock, User, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Appointment } from '../types';
import { Owner } from '../../owners/types';
import { Pet } from '../../pets/types';

interface AppointmentFormProps {
  owners: Owner[];
  pets: Pet[];
  veterinarians: any[];
  appointments: Appointment[];
  onClose: () => void;
  onSubmit: (data: Omit<Appointment, 'id' | 'registrationDate' | 'status'>) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: Partial<Omit<Appointment, 'id' | 'registrationDate' | 'status'>>;
}

export function AppointmentForm({ owners, pets, veterinarians, appointments, onClose, onSubmit, isSubmitting, initialData }: AppointmentFormProps) {
  const [step, setStep] = useState(0); // 0: Form, 1: Summary
  const [formData, setFormData] = useState({
    ownerId: initialData?.ownerId || '',
    petId: initialData?.petId || '',
    vetId: initialData?.vetId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '',
    reason: initialData?.reason || '',
    durationMinutes: initialData?.durationMinutes || 30
  });

  const [petSearch, setPetSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Search pets by name or owner name
  const searchedPets = useMemo(() => {
    if (!petSearch.trim() || !isDropdownOpen) return [];
    const search = petSearch.toLowerCase();
    return pets.filter(p => {
      const owner = owners.find(o => o.id === p.ownerId);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.toLowerCase() : '';
      return p.name.toLowerCase().includes(search) || ownerName.includes(search);
    }).slice(0, 5); // Limit results
  }, [petSearch, pets, owners, isDropdownOpen]);

  // Check veterinarian availability
  const availableVets = useMemo(() => {
    return veterinarians.filter(vet => {
      const isBusy = appointments.some(app => 
        app.vetId === vet.id && 
        app.date === formData.date && 
        app.time === formData.time &&
        app.status !== 'Cancelada'
      );
      return !isBusy;
    });
  }, [veterinarians, appointments, formData.date, formData.time]);

  // Suggest alternative times if conflict or no vets available
  const suggestions = useMemo(() => {
    if (!formData.date || !formData.time) return [];
    
    const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    
    // If a vet is selected, try to find times for THAT vet first
    if (formData.vetId) {
      const vetTimes = times.filter(t => {
        if (t === formData.time) return false;
        const isBusy = appointments.some(app => 
          app.vetId === formData.vetId && 
          app.date === formData.date && 
          app.time === t &&
          app.status !== 'Cancelada'
        );
        return !isBusy;
      });
      if (vetTimes.length > 0) return vetTimes.slice(0, 3);
    }

    // If no vet selected OR selected vet has no other times, find times where ANY vet is free
    return times.filter(t => {
      if (t === formData.time) return false;
      const freeVets = veterinarians.filter(vet => {
        const isBusy = appointments.some(app => 
          app.vetId === vet.id && 
          app.date === formData.date && 
          app.time === t &&
          app.status !== 'Cancelada'
        );
        return !isBusy;
      });
      return freeVets.length > 0;
    }).slice(0, 3);
  }, [formData.vetId, formData.date, formData.time, appointments, veterinarians]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.petId) newErrors.petId = 'Debe seleccionar una mascota';
    if (!formData.vetId) newErrors.vetId = 'Debe seleccionar un veterinario';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    if (!formData.time) newErrors.time = 'La hora es obligatoria';
    if (!formData.reason.trim()) newErrors.reason = 'El motivo de consulta es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep(1);
  };

  const handleConfirm = async () => {
    setServerError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setServerError('Error al agendar la cita');
    }
  };

  const selectedPet = pets.find(p => p.id === formData.petId);
  const selectedOwner = owners.find(o => o.id === (selectedPet?.ownerId || formData.ownerId));
  const selectedVet = veterinarians.find(v => v.id === formData.vetId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 0 ? 'bg-[#0A2540] text-white' : 'bg-green-100 text-green-600'}`}>
              {step === 0 ? '1' : <CheckCircle2 size={16} />}
            </div>
            <h2 className="text-xl font-bold text-[#0A2540]">
              {step === 0 ? 'Datos de la Cita' : 'Confirmar Agendamiento'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        {step === 0 ? (
          <form onSubmit={handleNext} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Search */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Search size={14} className="text-slate-400" />
                  Búsqueda de Paciente (Mascota o Propietario)
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Escriba nombre de mascota o dueño..."
                    className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.petId ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all shadow-sm`}
                    value={petSearch}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setPetSearch(e.target.value);
                      setIsDropdownOpen(true);
                      if (formData.petId) setFormData({...formData, petId: '', ownerId: ''});
                      if (errors.petId) setErrors({...errors, petId: ''}); // Clear error on type
                    }}
                  />
                  {isDropdownOpen && searchedPets.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2">
                      {searchedPets.map(p => {
                        const o = owners.find(owner => owner.id === p.ownerId);
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                            onClick={() => {
                              setFormData({...formData, petId: p.id, ownerId: p.ownerId});
                              setPetSearch(p.name);
                              setIsDropdownOpen(false); // Close explicitly
                              if (errors.petId) setErrors({...errors, petId: ''}); // Clear error on select
                            }}
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold text-[#0A2540]">{p.name}</p>
                              <p className="text-[11px] text-slate-500">{p.species} • {o?.firstName} {o?.lastName}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {formData.petId && !petSearch && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 animate-in fade-in">
                    <CheckCircle2 size={14} />
                    Paciente: {selectedPet?.name} ({selectedOwner?.firstName} {selectedOwner?.lastName})
                  </div>
                )}
                {errors.petId && <p className="text-[11px] text-red-500 font-bold">{errors.petId}</p>}
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  Fecha
                </label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all shadow-sm"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({...formData, date: e.target.value});
                    if (errors.date) setErrors({...errors, date: ''});
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  Hora
                </label>
                <input 
                  type="time" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all shadow-sm"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({...formData, time: e.target.value});
                    if (errors.time) setErrors({...errors, time: ''});
                  }}
                />
              </div>

              {/* Veterinarian Selection */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  Veterinario Asignado
                </label>
                <select 
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${errors.vetId ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all shadow-sm appearance-none`}
                  value={formData.vetId}
                  onChange={(e) => {
                    setFormData({...formData, vetId: e.target.value});
                    if (errors.vetId) setErrors({...errors, vetId: ''});
                  }}
                >
                  <option value="">Seleccione veterinario...</option>
                  {availableVets.map((v: any) => (
                    <option key={v.id} value={v.id}>
                      Dr/a. {v.username || v.firstName}
                    </option>
                  ))}
                </select>
                
                {availableVets.length === 0 && formData.date && formData.time && (
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex items-start gap-2 text-amber-800 text-sm font-bold">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p>No hay veterinarios disponibles</p>
                        <p className="text-[11px] font-medium opacity-80">Todos los doctores están ocupados en este horario para el día seleccionado.</p>
                      </div>
                    </div>
                    
                    {suggestions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-amber-200/50">
                        <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">Prueba con estos horarios libres:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map(t => (
                            <button
                              key={t}
                              type="button"
                              className="px-3 py-1.5 bg-white border border-amber-200 text-amber-800 text-xs font-bold rounded-lg hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm flex items-center gap-1"
                              onClick={() => setFormData({...formData, time: t})}
                            >
                              <Clock size={12} />
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Conflict Alert */}
                {formData.vetId && !availableVets.some(av => av.id === formData.vetId) && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex items-start gap-2 text-red-800 text-sm font-bold">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <p>Horario No Disponible</p>
                        <p className="text-[11px] font-medium opacity-80">El veterinario seleccionado ya tiene una cita programada para este momento.</p>
                      </div>
                    </div>
                    
                    {suggestions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-red-200/50">
                        <p className="text-[11px] text-red-700 font-bold uppercase tracking-wider">Horarios Libres Sugeridos:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map(t => (
                            <button
                              key={t}
                              type="button"
                              className="px-3 py-1.5 bg-white border border-red-200 text-red-800 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm flex items-center gap-1"
                              onClick={() => setFormData({...formData, time: t})}
                            >
                              <Clock size={12} />
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reason */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Motivo de Consulta (Obligatorio)</label>
                <textarea 
                  className={`w-full px-4 py-3 bg-slate-50 border ${errors.reason ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all shadow-sm min-h-[100px] text-sm`}
                  value={formData.reason}
                  onChange={(e) => {
                    setFormData({...formData, reason: e.target.value});
                    if (errors.reason) setErrors({...errors, reason: ''});
                  }}
                  placeholder="Describa el motivo de la visita..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all">
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-8 py-2.5 bg-[#0A2540] text-white rounded-xl font-bold text-sm hover:bg-[#113255] transition-all shadow-lg shadow-[#0A2540]/20 flex items-center gap-2"
              >
                Continuar
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <Info size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900">Resumen de la Cita</h3>
                <p className="text-xs text-blue-700 mt-1">Por favor, verifique los datos antes de confirmar el agendamiento definitivo.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paciente</p>
                <p className="text-sm font-bold text-[#0A2540]">{selectedPet?.name}</p>
                <p className="text-xs text-slate-500">{selectedPet?.species} • {selectedPet?.breed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Propietario</p>
                <p className="text-sm font-bold text-[#0A2540]">{selectedOwner?.firstName} {selectedOwner?.lastName}</p>
                <p className="text-xs text-slate-500">{selectedOwner?.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Veterinario</p>
                <p className="text-sm font-bold text-[#0A2540]">Dr/a. {selectedVet?.username || selectedVet?.firstName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha y Hora</p>
                <div className="flex items-center gap-2 text-sm font-bold text-[#0A2540]">
                  <Calendar size={14} className="text-blue-500" />
                  {formData.date}
                  <Clock size={14} className="text-blue-500 ml-2" />
                  {formData.time}
                </div>
              </div>
              <div className="col-span-2 space-y-1 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Motivo de Consulta</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{formData.reason}</p>
              </div>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-bold animate-pulse">
                <AlertCircle size={16} />
                {serverError}
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setStep(0)} 
                className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
                disabled={isSubmitting}
              >
                Volver a editar
              </button>
              <button 
                onClick={handleConfirm} 
                disabled={isSubmitting}
                className="px-10 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? 'Guardando...' : 'Confirmar y Guardar'}
                {!isSubmitting && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
