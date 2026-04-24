import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Owner } from '../types';

interface OwnerFormProps {
  owner?: Owner;
  onClose: () => void;
  onSubmit: (data: Omit<Owner, 'id' | 'registrationDate'>) => void;
  isSubmitting?: boolean;
}

export function OwnerForm({ owner, onClose, onSubmit, isSubmitting }: OwnerFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identification: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (owner) {
      setFormData({
        firstName: owner.firstName,
        lastName: owner.lastName,
        identification: owner.identification,
        email: owner.email,
        phone: owner.phone,
        address: owner.address,
        notes: owner.notes || ''
      });
    }
  }, [owner]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.identification) newErrors.identification = 'La identificación es obligatoria';
    if (!formData.phone) newErrors.phone = 'El teléfono es obligatorio';
    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del correo no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">
            {owner ? 'Editar Propietario' : 'Registrar Nuevo Propietario'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Nombre(s) *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Apellido(s) *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Número de Identificación *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2 border ${errors.identification ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.identification}
                onChange={(e) => setFormData({...formData, identification: e.target.value})}
                placeholder="C.C., T.I., etc."
              />
              {errors.identification && <p className="text-xs text-red-500">{errors.identification}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Teléfono *</label>
              <input 
                type="tel" 
                className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Correo Electrónico *</label>
              <input 
                type="email" 
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Dirección</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Notas Adicionales</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all min-h-[100px]"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observaciones especiales sobre el cliente..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 disabled:opacity-70 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                owner ? 'Guardar Cambios' : 'Registrar Propietario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
