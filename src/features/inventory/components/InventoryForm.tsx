import React, { useState, useEffect } from 'react';
import { X, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem, ItemCategory } from '../types';
import { useInventory } from '../hooks/useInventory';

interface InventoryFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'registrationDate'>) => void;
}

export function InventoryForm({ onClose, onSubmit }: InventoryFormProps) {
  const { items } = useInventory();
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Medicamento' as ItemCategory,
    presentation: '',
    unit: 'ml',
    stock: 0,
    minStock: 5,
    expiryDate: '',
    provider: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido';
    } else if (items.some(item => item.code.toLowerCase() === formData.code.trim().toLowerCase())) {
      newErrors.code = 'Este código ya está registrado en el inventario';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.presentation.trim()) {
      newErrors.presentation = 'La presentación es requerida';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'La fecha de vencimiento es requerida';
    } else {
      const today = new Date();
      today.setHours(0,0,0,0);
      const expDate = new Date(formData.expiryDate);
      if (expDate <= today) {
        newErrors.expiryDate = 'La fecha de vencimiento debe ser posterior a hoy';
      }
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">Registrar Insumo / Medicamento</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Código Único *</label>
              <input 
                type="text" 
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.code ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.code}
                onChange={(e) => {
                  setFormData({...formData, code: e.target.value});
                  if (errors.code) setErrors({...errors, code: ''});
                }}
              />
              {errors.code && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.code}</p>}
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
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
            />
            {errors.name && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Presentación *</label>
              <input 
                type="text" 
                placeholder="Ej: Frasco 10ml, Caja x 30"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.presentation ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.presentation}
                onChange={(e) => {
                  setFormData({...formData, presentation: e.target.value});
                  if (errors.presentation) setErrors({...errors, presentation: ''});
                }}
              />
              {errors.presentation && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.presentation}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Unidad de Medida *</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
              >
                <option value="ml">Mililitros (ml)</option>
                <option value="mg">Miligramos (mg)</option>
                <option value="g">Gramos (g)</option>
                <option value="unidades">Unidades</option>
                <option value="dosis">Dosis</option>
                <option value="comprimidos">Comprimidos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stock Inicial *</label>
              <input 
                type="number" 
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.stock ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.stock}
                onChange={(e) => {
                  setFormData({...formData, stock: parseInt(e.target.value) || 0});
                  if (errors.stock) setErrors({...errors, stock: ''});
                }}
              />
              {errors.stock && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.stock}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Stock Mínimo *</label>
              <input 
                type="number" 
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.minStock ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.minStock}
                onChange={(e) => {
                  setFormData({...formData, minStock: parseInt(e.target.value) || 0});
                  if (errors.minStock) setErrors({...errors, minStock: ''});
                }}
              />
              {errors.minStock && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.minStock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Fecha Vencimiento *</label>
              <input 
                type="date" 
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.expiryDate ? 'border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-[#A8DADC]'}`}
                value={formData.expiryDate}
                onChange={(e) => {
                  setFormData({...formData, expiryDate: e.target.value});
                  if (errors.expiryDate) setErrors({...errors, expiryDate: ''});
                }}
              />
              {errors.expiryDate && <p className="text-xs text-red-600 flex items-center gap-1 mt-1"><AlertTriangle size={12}/> {errors.expiryDate}</p>}
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

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Descripción Adicional</label>
            <textarea 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none min-h-[60px]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalles adicionales del producto..."
            />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3 justify-end">
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
