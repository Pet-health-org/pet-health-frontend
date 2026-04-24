import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Consultation, VitalSigns } from '../types';
import { Pet, SPECIES_VITAL_RANGES } from '../../pets/types';

interface ConsultationFormProps {
  pet: Pet;
  onClose: () => void;
  onSubmit: (data: Omit<Consultation, 'id' | 'registrationDate'>) => void;
  isSubmitting?: boolean;
}

export function ConsultationForm({ pet, onClose, onSubmit, isSubmitting }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    petId: pet.id,
    vetId: 'v1', // Mock current vet
    date: new Date().toISOString().split('T')[0],
    reason: '',
    anamnesis: '',
    physicalExam: '',
    vitals: {
      weight: pet.weight,
      temperature: 38.5,
      heartRate: 80,
      respiratoryRate: 20
    },
    diagnosis: '',
    treatment: '',
    observations: ''
  });

  const [vitalsStatus, setVitalsStatus] = useState<Record<string, boolean>>({});
  const ranges = SPECIES_VITAL_RANGES[pet.species];

  useEffect(() => {
    const status = {
      temperature: formData.vitals.temperature < ranges.temperature.min || formData.vitals.temperature > ranges.temperature.max,
      heartRate: formData.vitals.heartRate < ranges.heartRate.min || formData.vitals.heartRate > ranges.heartRate.max,
      respiratoryRate: formData.vitals.respiratoryRate < ranges.respiratoryRate.min || formData.vitals.respiratoryRate > ranges.respiratoryRate.max,
    };
    setVitalsStatus(status);
  }, [formData.vitals, ranges]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, if vitals are out of range, we might ask for justification (HU-12)
    onSubmit(formData);
  };

  const handleVitalChange = (name: keyof VitalSigns, value: number) => {
    setFormData({
      ...formData,
      vitals: { ...formData.vitals, [name]: value }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">Nueva Consulta</h2>
            <p className="text-xs text-slate-500">Paciente: <span className="font-bold">{pet.name}</span> ({pet.species})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Motivo de Consulta *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Anamnesis *</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[100px]"
                  value={formData.anamnesis}
                  onChange={(e) => setFormData({...formData, anamnesis: e.target.value})}
                  placeholder="Historia del problema actual..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Examen Físico *</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[100px]"
                  value={formData.physicalExam}
                  onChange={(e) => setFormData({...formData, physicalExam: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Vitals and Results */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-[#0A2540] mb-3 flex items-center gap-2">
                  Constantes Vitales
                  <span className="text-[10px] font-normal text-slate-400">(Rangos para {pet.species})</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Temperatura (°C)</label>
                    <input 
                      type="number" step="0.1"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.temperature ? 'border-amber-400 bg-amber-50' : 'border-slate-300'}`}
                      value={formData.vitals.temperature}
                      onChange={(e) => handleVitalChange('temperature', parseFloat(e.target.value))}
                    />
                    {vitalsStatus.temperature && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700">
                        <AlertTriangle size={10} /> Fuera de rango ({ranges.temperature.min}-{ranges.temperature.max})
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Frec. Cardíaca (bpm)</label>
                    <input 
                      type="number"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.heartRate ? 'border-amber-400 bg-amber-50' : 'border-slate-300'}`}
                      value={formData.vitals.heartRate}
                      onChange={(e) => handleVitalChange('heartRate', parseFloat(e.target.value))}
                    />
                    {vitalsStatus.heartRate && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700">
                        <AlertTriangle size={10} /> Fuera de rango ({ranges.heartRate.min}-{ranges.heartRate.max})
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Frec. Respiratoria (rpm)</label>
                    <input 
                      type="number"
                      className={`w-full px-3 py-1.5 border rounded-lg outline-none transition-all ${vitalsStatus.respiratoryRate ? 'border-amber-400 bg-amber-50' : 'border-slate-300'}`}
                      value={formData.vitals.respiratoryRate}
                      onChange={(e) => handleVitalChange('respiratoryRate', parseFloat(e.target.value))}
                    />
                    {vitalsStatus.respiratoryRate && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-700">
                        <AlertTriangle size={10} /> Fuera de rango ({ranges.respiratoryRate.min}-{ranges.respiratoryRate.max})
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Peso (kg)</label>
                    <input 
                      type="number" step="0.1"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none"
                      value={formData.vitals.weight}
                      onChange={(e) => handleVitalChange('weight', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Diagnóstico *</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[80px]"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Tratamiento *</label>
                <textarea 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[80px]"
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2">
              {isSubmitting ? 'Guardando...' : 'Finalizar Consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
