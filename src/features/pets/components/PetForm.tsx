import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Pet, Species } from '../types';
import { Owner } from '../../owners/types';

interface PetFormProps {
  pet?: Pet;
  owners: Owner[];
  onClose: () => void;
  onSubmit: (data: Omit<Pet, 'id' | 'registrationDate'>) => void;
  isSubmitting?: boolean;
  preselectedOwnerId?: string;
}

export function PetForm({ pet, owners, onClose, onSubmit, isSubmitting, preselectedOwnerId }: PetFormProps) {
  const [formData, setFormData] = useState({
    ownerId: preselectedOwnerId || '',
    name: '',
    species: 'Perro' as Species,
    breed: '',
    birthDate: '',
    sex: 'Macho' as 'Macho' | 'Hembra',
    color: '',
    weight: 0,
    observations: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pet) {
      setFormData({
        ownerId: pet.ownerId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        birthDate: pet.birthDate.split('T')[0],
        sex: pet.sex,
        color: pet.color,
        weight: pet.weight,
        observations: pet.observations || ''
      });
    }
  }, [pet]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ownerId) newErrors.ownerId = 'Debe seleccionar un propietario';
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.species) newErrors.species = 'La especie es obligatoria';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    if (formData.weight <= 0) newErrors.weight = 'El peso debe ser un valor numérico positivo';
    
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
            {pet ? 'Editar Mascota' : 'Registrar Nueva Mascota'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Propietario *</label>
              <select 
                className={`w-full px-4 py-2 border ${errors.ownerId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.ownerId}
                onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                disabled={!!preselectedOwnerId}
              >
                <option value="">Seleccione un propietario...</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.firstName} {owner.lastName} ({owner.identification})
                  </option>
                ))}
              </select>
              {errors.ownerId && <p className="text-xs text-red-500">{errors.ownerId}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Nombre de la Mascota *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Especie *</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
                value={formData.species}
                onChange={(e) => setFormData({...formData, species: e.target.value as Species})}
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Raza</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                placeholder={formData.species === 'Perro' ? 'Ej: Golden Retriever' : 'Raza o variedad'}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha de Nacimiento *</label>
              <input 
                type="date" 
                className={`w-full px-4 py-2 border ${errors.birthDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
              {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Sexo</label>
              <div className="flex gap-4 p-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="sex" 
                    value="Macho"
                    checked={formData.sex === 'Macho'}
                    onChange={() => setFormData({...formData, sex: 'Macho'})}
                    className="w-4 h-4 text-[#0A2540]"
                  />
                  <span className="text-sm text-slate-600">Macho</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="sex" 
                    value="Hembra"
                    checked={formData.sex === 'Hembra'}
                    onChange={() => setFormData({...formData, sex: 'Hembra'})}
                    className="w-4 h-4 text-[#0A2540]"
                  />
                  <span className="text-sm text-slate-600">Hembra</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Color / Señas</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Peso (kg) *</label>
              <input 
                type="number" 
                step="0.1"
                className={`w-full px-4 py-2 border ${errors.weight ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
              />
              {errors.weight && <p className="text-xs text-red-500">{errors.weight}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Observaciones</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all min-h-[80px]"
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
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
              {isSubmitting ? 'Procesando...' : (pet ? 'Guardar Cambios' : 'Registrar Mascota')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
