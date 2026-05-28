import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { VACCINE_SCHEMES } from '../types';
import { Pet } from '../../pets/types';
import { useInventory } from '../../inventory/hooks/useInventory';
import { getHistoriasClinicasByMascota } from '../../../services/historias-clinicas.service';

interface VaccineFormProps {
  pet: Pet;
  onClose: () => void;
  onSubmit: (data: {
    historiaClinicaId: string;
    inventarioId: string;
    nombre: string;
    fechaAplicacion: string;
    dosis: string;
    lote: string;
    fechaProximoRefuerzo?: string;
  }) => void;
  isSubmitting?: boolean;
}

interface HistoriaClinicaOption {
  id: string;
  fecha: string;
  diagnostico: string;
}

export function VaccineForm({ pet, onClose, onSubmit, isSubmitting }: VaccineFormProps) {
  const scheme = VACCINE_SCHEMES.find(s => s.species === pet.species);
  const { items: inventoryItems } = useInventory();
  const vaccineInventoryItems = inventoryItems.filter(item => item.category === 'Vacuna');

  const [histories, setHistories] = useState<HistoriaClinicaOption[]>([]);
  const [formData, setFormData] = useState({
    historiaClinicaId: '',
    inventarioId: '',
    vaccineName: '',
    applicationDate: new Date().toISOString().split('T')[0],
    batchNumber: '',
    nextBoosterDate: '',
    dose: '1/1',
    notes: ''
  });

  useEffect(() => {
    getHistoriasClinicasByMascota(pet.id)
      .then(res => setHistories(res.data || []))
      .catch(() => setHistories([]));
  }, [pet.id]);

  useEffect(() => {
    if (formData.vaccineName && scheme) {
      const vaccineInfo = scheme.vaccines.find(v => v.name === formData.vaccineName);
      if (vaccineInfo) {
        const appDate = new Date(formData.applicationDate);
        const boosterDate = new Date(appDate);
        boosterDate.setMonth(boosterDate.getMonth() + vaccineInfo.boosterIntervalMonths);
        setFormData(prev => ({
          ...prev,
          nextBoosterDate: boosterDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [formData.vaccineName, formData.applicationDate, scheme]);

  const selectedInventoryItem = inventoryItems.find(item => item.id === formData.inventarioId);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.historiaClinicaId) errors.historiaClinicaId = 'Debe seleccionar una historia clínica';
    if (!formData.inventarioId) errors.inventarioId = 'Debe seleccionar un producto de inventario';
    if (!formData.vaccineName.trim()) errors.vaccineName = 'Selecciona una vacuna';
    if (!formData.batchNumber.trim()) errors.batchNumber = 'El lote es requerido';
    if (!formData.applicationDate) errors.applicationDate = 'La fecha de aplicación es obligatoria';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        historiaClinicaId: formData.historiaClinicaId,
        inventarioId: formData.inventarioId,
        nombre: formData.vaccineName,
        fechaAplicacion: formData.applicationDate,
        dosis: formData.dose,
        lote: formData.batchNumber,
        fechaProximoRefuerzo: formData.nextBoosterDate || undefined,
      });
    }
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
            <label className="text-sm font-semibold text-slate-700">Historia Clínica *</label>
            <select
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${fieldErrors.historiaClinicaId ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
              value={formData.historiaClinicaId}
              onChange={(e) => {
                setFormData({ ...formData, historiaClinicaId: e.target.value });
                if (fieldErrors.historiaClinicaId) setFieldErrors({ ...fieldErrors, historiaClinicaId: '' });
              }}
              required
            >
              <option value="">Seleccione una historia clínica...</option>
              {histories.map(history => (
                <option key={history.id} value={history.id}>
                  {new Date(history.fecha).toLocaleDateString()} - {history.diagnostico}
                </option>
              ))}
            </select>
            {fieldErrors.historiaClinicaId && <p className="text-xs text-red-600">{fieldErrors.historiaClinicaId}</p>}
            {histories.length === 0 && <p className="text-xs text-slate-500">No hay historias clínicas disponibles. Registre una consulta primero.</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Producto de Inventario *</label>
            <select
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${fieldErrors.inventarioId ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
              value={formData.inventarioId}
              onChange={(e) => {
                setFormData({ ...formData, inventarioId: e.target.value });
                if (fieldErrors.inventarioId) setFieldErrors({ ...fieldErrors, inventarioId: '' });
              }}
              required
            >
              <option value="">Seleccione vacuna del inventario...</option>
              {vaccineInventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} {item.provider ? `(${item.provider})` : ''}
                </option>
              ))}
            </select>
            {fieldErrors.inventarioId && <p className="text-xs text-red-600">{fieldErrors.inventarioId}</p>}
            {vaccineInventoryItems.length === 0 && <p className="text-xs text-slate-500">No hay vacunas disponibles en inventario.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Vacuna *</label>
              <select
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${fieldErrors.vaccineName ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.vaccineName}
                onChange={(e) => {
                  setFormData({ ...formData, vaccineName: e.target.value });
                  if (fieldErrors.vaccineName) setFieldErrors({ ...fieldErrors, vaccineName: '' });
                }}
                required
              >
                <option value="">Seleccione vacuna...</option>
                {scheme?.vaccines.map(v => (
                  <option key={v.name} value={v.name}>{v.name} ({v.isMandatory ? 'Obligatoria' : 'Opcional'})</option>
                ))}
                <option value="Otra">Otra (No en el esquema)</option>
              </select>
              {fieldErrors.vaccineName && <p className="text-xs text-red-600">{fieldErrors.vaccineName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Dosis *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.dose}
                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Lote *</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${fieldErrors.batchNumber ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.batchNumber}
                onChange={(e) => {
                  setFormData({ ...formData, batchNumber: e.target.value });
                  if (fieldErrors.batchNumber) setFieldErrors({ ...fieldErrors, batchNumber: '' });
                }}
                required
              />
              {fieldErrors.batchNumber && <p className="text-xs text-red-600">{fieldErrors.batchNumber}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha Aplicación *</label>
              <input
                type="date"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${fieldErrors.applicationDate ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.applicationDate}
                onChange={(e) => {
                  setFormData({ ...formData, applicationDate: e.target.value });
                  if (fieldErrors.applicationDate) setFieldErrors({ ...fieldErrors, applicationDate: '' });
                }}
                required
              />
              {fieldErrors.applicationDate && <p className="text-xs text-red-600">{fieldErrors.applicationDate}</p>}
            </div>
          </div>

          {selectedInventoryItem && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p><strong>Producto seleccionado:</strong> {selectedInventoryItem.name}</p>
              <p><strong>Proveedor:</strong> {selectedInventoryItem.provider || 'N/A'}</p>
              <p><strong>Vencimiento en inventario:</strong> {selectedInventoryItem.expiryDate ? new Date(selectedInventoryItem.expiryDate).toLocaleDateString() : 'Sin fecha'}</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Próximo Refuerzo</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none bg-blue-50/50"
              value={formData.nextBoosterDate}
              onChange={(e) => setFormData({ ...formData, nextBoosterDate: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Notas</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[60px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || histories.length === 0 || vaccineInventoryItems.length === 0} className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2">
              <Calendar size={18} />
              {isSubmitting ? 'Registrando...' : 'Registrar Aplicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
