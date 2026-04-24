import React, { useState } from 'react';
import { X, Package } from 'lucide-react';
import { InventoryItem, ItemCategory } from '../types';

interface InventoryFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'registrationDate'>) => void;
}

export function InventoryForm({ onClose, onSubmit }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Medicamento' as ItemCategory,
    presentation: '',
    unit: 'unidades',
    stock: 0,
    minStock: 5,
    expiryDate: '',
    provider: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">Registrar Insumo / Medicamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Código Único *</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Categoría *</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as ItemCategory})}
              >
                <option value="Medicamento">Medicamento</option>
                <option value="Vacuna">Vacuna</option>
                <option value="Insumo">Insumo</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Nombre del Producto *</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Presentación *</label>
              <input 
                type="text" 
                placeholder="Ej: Frasco 10ml, Caja x 30"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.presentation}
                onChange={(e) => setFormData({...formData, presentation: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Unidad de Medida *</label>
              <input 
                type="text" 
                placeholder="unidades, ml, mg"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stock Inicial *</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stock Mínimo *</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha Vencimiento *</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Proveedor</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.provider}
                onChange={(e) => setFormData({...formData, provider: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2">
              <Package size={18} />
              Guardar en Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
