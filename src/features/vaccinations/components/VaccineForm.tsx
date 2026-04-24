import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { VaccinationRecord, VACCINE_SCHEMES } from '../types';
import { Pet } from '../../pets/types';

interface VaccineFormProps {
  pet: Pet;
  onClose: () => void;
  onSubmit: (data: Omit<VaccinationRecord, 'id'>) => void;
  isSubmitting?: boolean;
}

export function VaccineForm({ pet, onClose, onSubmit, isSubmitting }: VaccineFormProps) {
  const scheme = VACCINE_SCHEMES.find(s => s.species === pet.species);
  
  const [formData, setFormData] = useState({
    petId: pet.id,
    vaccineName: '',
    applicationDate: new Date().toISOString().split('T')[0],
    batchNumber: '',
    expiryDate: '',
    nextBoosterDate: '',
    vetId: 'v1',
    notes: ''
  });

  // Calculate next booster automatically based on scheme (HU-13)
  useEffect(() => {
    if (formData.vaccineName && scheme) {
      const vaccineInfo = scheme.vaccines.find(v => v.name === formData.vaccineName);
      if (vaccineInfo) {
        const appDate = new Date(formData.applicationDate);
        const boosterDate = new Date(appDate.setMonth(appDate.getMonth() + vaccineInfo.boosterIntervalMonths));
        setFormData(prev => ({
          ...prev,
          nextBoosterDate: boosterDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [formData.vaccineName, formData.applicationDate, scheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">Registrar Vacuna</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Vacuna *</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
              value={formData.vaccineName}
              onChange={(e) => setFormData({...formData, vaccineName: e.target.value})}
              required
            >
              <option value="">Seleccione vacuna...</option>
              {scheme?.vaccines.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.isMandatory ? 'Obligatoria' : 'Opcional'})</option>
              ))}
              <option value="Otra">Otra (No en el esquema)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Lote *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.batchNumber}
                onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Vencimiento Lote *</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha Aplicación *</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.applicationDate}
                onChange={(e) => setFormData({...formData, applicationDate: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Próximo Refuerzo *</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none bg-blue-50/50"
                value={formData.nextBoosterDate}
                onChange={(e) => setFormData({...formData, nextBoosterDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Notas</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[60px]"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2">
              <Calendar size={18} />
              {isSubmitting ? 'Registrando...' : 'Registrar Aplicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
