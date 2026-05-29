import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { Pet } from '../types';
import { Owner } from '../../owners/types';
import { findAll as getEspecies } from '../../../services/especie.service';
import { findByEspecie as getRazasByEspecie } from '../../../services/raza.service';

interface PetFormProps {
  pet?: Pet;
  owners: Owner[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  preselectedOwnerId?: string;
}

export function PetForm({ pet, owners, onClose, onSubmit, isSubmitting, preselectedOwnerId }: PetFormProps) {
  const [especies, setEspecies] = useState<any[]>([]);
  const [razas, setRazas] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    speciesId: '',
    breedId: '',
    customSpecies: '',
    customBreed: '',
    ownerId: preselectedOwnerId || '',
    name: '',
    birthDate: '',
    sex: 'Macho',
    color: '',
    weight: '' as number | string,
    observations: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Owner autocomplete state
  const [ownerSearch, setOwnerSearch] = useState('');
  const [ownerResults, setOwnerResults] = useState<Owner[]>([]);
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch Especies
  useEffect(() => {
    getEspecies().then(res => setEspecies(res.data)).catch(console.error);
  }, []);

  // Fetch Razas based on species string or UUID (mapping to DB ID)
  useEffect(() => {
    if (formData.speciesId && formData.speciesId !== 'otro') {
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(formData.speciesId);
      
      let targetEspecieId = '';
      if (isUuid) {
        targetEspecieId = formData.speciesId;
      } else {
        const sId = formData.speciesId.toLowerCase();
        const dbSpecies = especies.find(e => {
          const name = e.nombre.toLowerCase();
          return name.includes(sId) || (sId === 'perro' && name.includes('canin')) || (sId === 'gato' && name.includes('felin'));
        });
        if (dbSpecies) {
          targetEspecieId = dbSpecies.id;
        }
      }

      if (targetEspecieId) {
        getRazasByEspecie(targetEspecieId)
          .then(res => setRazas(res.data))
          .catch(console.error);
      } else {
        setRazas([]);
      }
    } else {
      setRazas([]);
    }
  }, [formData.speciesId, especies]);

  // Load Initial Data
  useEffect(() => {
    if (pet) {
      // Find the enum-compatible string for the pet's species
      let speciesVal = pet.speciesId || '';
      if (pet.species) {
        const lowerName = pet.species.toLowerCase();
        if (lowerName.includes('perro')) speciesVal = 'perro';
        else if (lowerName.includes('gato')) speciesVal = 'gato';
        else if (lowerName.includes('ave')) speciesVal = 'ave';
        else speciesVal = 'otro';
      }

      setFormData({
        speciesId: speciesVal,
        breedId: pet.breedId || '',
        customSpecies: pet.customSpecies || '',
        customBreed: pet.customBreed || '',
        ownerId: pet.ownerId,
        name: pet.name,
        birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : '',
        sex: pet.sex,
        color: pet.color,
        weight: pet.weight,
        observations: pet.observations || ''
      });
      const owner = owners.find(o => o.id === pet.ownerId);
      if (owner) setOwnerSearch(`${owner.firstName} ${owner.lastName}`);
    }
  }, [pet, owners]);

  // Owner search logic
  useEffect(() => {
    if (!ownerSearch || ownerSearch.length < 2) {
      setOwnerResults([]);
      setIsOwnerDropdownOpen(false);
      return;
    }
    const exactMatch = owners.find(o => `${o.firstName} ${o.lastName}` === ownerSearch);
    if (exactMatch && formData.ownerId === exactMatch.id) {
      setOwnerResults([]);
      setIsOwnerDropdownOpen(false);
      return;
    }

    const filtered = owners.filter(o =>
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      o.identification.includes(ownerSearch)
    );
    setOwnerResults(filtered);
    setIsOwnerDropdownOpen(true);
  }, [ownerSearch, owners, formData.ownerId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOwnerDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const selectOwner = (owner: Owner) => {
    setOwnerSearch(`${owner.firstName} ${owner.lastName}`);
    setFormData(prev => ({ ...prev, ownerId: owner.id }));
    setIsOwnerDropdownOpen(false);
    setErrors(prev => {
      const e = { ...prev };
      delete e.ownerId;
      return e;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.speciesId) newErrors.speciesId = 'La especie es obligatoria';
    if (formData.speciesId === 'otro' && !formData.customSpecies) {
      newErrors.customSpecies = 'Especifique la especie';
    }

    if (!formData.breedId) newErrors.breedId = 'La raza es obligatoria';
    if (formData.breedId === 'otro' && !formData.customBreed) {
      newErrors.customBreed = 'Especifique la raza';
    }
    if (!formData.ownerId) newErrors.ownerId = 'Debe seleccionar un propietario';
    if (!formData.name) newErrors.name = 'El nombre es obligatorio';
    if (!formData.birthDate) newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    const weightNum = Number(formData.weight);
    if (isNaN(weightNum) || weightNum <= 0) newErrors.weight = 'El peso debe ser un valor numérico positivo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const selectedSpecies = especies.find(esp => esp.id === formData.speciesId);

      // Determine the readable name for the species
      let speciesName = '';
      if (formData.speciesId === 'otro') {
        speciesName = formData.customSpecies;
      } else if (selectedSpecies) {
        speciesName = selectedSpecies.nombre;
      } else {
        // If it's one of our hardcoded options (perro, gato, ave)
        speciesName = formData.speciesId.charAt(0).toUpperCase() + formData.speciesId.slice(1);
      }

      const selectedBreed = razas.find(raz => raz.id === formData.breedId);

      onSubmit({
        ...formData,
        weight: Number(formData.weight),
        speciesName: speciesName,
        breedName: formData.breedId === 'otro' ? formData.customBreed : (selectedBreed?.nombre || '')
      });
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

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Especie *</label>
              <select
                className={`w-full px-4 py-2 border ${errors.speciesId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.speciesId}
                onChange={(e) => {
                  setFormData({ ...formData, speciesId: e.target.value, breedId: '', customSpecies: '', customBreed: '' });
                }}
              >
                <option value="">Seleccione una especie...</option>
                {especies.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
                <option value="otro">Otro (Especificar)</option>
              </select>
              {errors.speciesId && <p className="text-xs text-red-500">{errors.speciesId}</p>}
            </div>

            {formData.speciesId === 'otro' && (
              <div className="md:col-span-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-semibold text-slate-700">¿Cuál especie? *</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.customSpecies ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                  placeholder="Ej: Hurón, Conejo, Reptil..."
                  value={formData.customSpecies}
                  onChange={(e) => setFormData({ ...formData, customSpecies: e.target.value })}
                />
                {errors.customSpecies && <p className="text-xs text-red-500">{errors.customSpecies}</p>}
              </div>
            )}

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Raza *</label>
              <select
                className={`w-full px-4 py-2 border ${errors.breedId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.breedId}
                onChange={(e) => setFormData({ ...formData, breedId: e.target.value, customBreed: '' })}
                disabled={!formData.speciesId}
              >
                <option value="">Seleccione una raza...</option>
                {razas.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
                {formData.speciesId && <option value="otro">Otra (Especificar)</option>}
              </select>
              {errors.breedId && <p className="text-xs text-red-500">{errors.breedId}</p>}
            </div>

            {formData.breedId === 'otro' && (
              <div className="md:col-span-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-semibold text-slate-700">¿Cuál raza? *</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.customBreed ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                  placeholder="Ej: Criollo, Angora, Especie única..."
                  value={formData.customBreed}
                  onChange={(e) => setFormData({ ...formData, customBreed: e.target.value })}
                />
                {errors.customBreed && <p className="text-xs text-red-500">{errors.customBreed}</p>}
              </div>
            )}

            <div className="md:col-span-2 space-y-1 relative" ref={dropdownRef}>
              <label className="text-sm font-semibold text-slate-700">Propietario *</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar propietario por nombre o documento..."
                  className={`w-full pl-10 pr-4 py-2 border ${errors.ownerId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                  value={ownerSearch}
                  onChange={(e) => {
                    setOwnerSearch(e.target.value);
                    if (formData.ownerId) setFormData({ ...formData, ownerId: '' });
                  }}
                  disabled={!!preselectedOwnerId}
                  onFocus={() => { if (ownerResults.length > 0) setIsOwnerDropdownOpen(true); }}
                />
              </div>
              {errors.ownerId && <p className="text-xs text-red-500">{errors.ownerId}</p>}

              {isOwnerDropdownOpen && ownerResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {ownerResults.map(owner => (
                    <div
                      key={owner.id}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                      onClick={() => selectOwner(owner)}
                    >
                      <div className="font-medium text-slate-800">{owner.firstName} {owner.lastName}</div>
                      <div className="text-xs text-slate-500">ID: {owner.identification}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Nombre de la Mascota *</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha de Nacimiento *</label>
              <input
                type="date"
                className={`w-full px-4 py-2 border ${errors.birthDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                    onChange={() => setFormData({ ...formData, sex: 'Macho' })}
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
                    onChange={() => setFormData({ ...formData, sex: 'Hembra' })}
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
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Peso (kg) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className={`w-full px-4 py-2 border ${errors.weight ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all`}
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              />
              {errors.weight && <p className="text-xs text-red-500">{errors.weight}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">Observaciones</label>
              <span className="text-[10px] text-amber-600 block bg-amber-50 px-2 py-1 rounded border border-amber-100 mb-1">
                ⚠️ Las observaciones no se guardarán en la base de datos hasta que los programadores de backend agreguen esta columna.
              </span>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all min-h-[80px]"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
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
