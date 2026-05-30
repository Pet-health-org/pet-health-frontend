import React, { useState, useEffect } from "react";
import { X, Package, AlertTriangle } from "lucide-react";
import { ItemCategory } from "../types";
import {
  create as createProveedor,
  getProveedores,
} from "../../../services/proveedor.service";

interface InventoryFormProps {
  onClose: () => void;
  items: Array<{ code: string }>;
  onSubmit: (data: {
    proveedorId: string;
    codigo: string;
    nombreProducto: string;
    descripcion: string;
    presentacion: string;
    unidadMedida: string;
    tipo: ItemCategory;
    stockActual: number;
    stockMinimo: number;
    fechaVencimiento: string;
    precioUnitario: number;
  }) => void;
}

interface ProviderOption {
  id: string;
  nombreEmpresa: string;
}

export function InventoryForm({
  onClose,
  onSubmit,
  items,
}: InventoryFormProps) {
  const [providers, setProviders] = useState<ProviderOption[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const [formData, setFormData] = useState({
    codigo: "",
    name: "",
    descripcion: "",
    presentacion: "",
    unidadMedida: "unidades",
    category: "Medicamento" as ItemCategory,
    stock: 0,
    minStock: 5,
    expiryDate: "",
    proveedorId: "",
    price: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProviderFormOpen, setIsProviderFormOpen] = useState(false);
  const [isSavingProvider, setIsSavingProvider] = useState(false);
  const [providerErrors, setProviderErrors] = useState<Record<string, string>>(
    {},
  );
  const [providerData, setProviderData] = useState({
    nombreEmpresa: "",
    contacto: "",
    telefono: "",
    correo: "",
    direccion: "",
    condicionesPago: "",
  });

  const fetchProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const res = await getProveedores();
      setProviders(res.data || []);
    } catch {
      setProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código es requerido";
    } else if (items.some((i) => i.code === formData.codigo.trim())) {
      newErrors.codigo = "Ya existe un producto con este código";
    }
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es requerido";
    }
    if (!formData.unidadMedida) {
      newErrors.unidadMedida = "La unidad de medida es requerida";
    }
    if (formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }
    if (formData.minStock < 0) {
      newErrors.minStock = "El stock mínimo no puede ser negativo";
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "La fecha de vencimiento es requerida";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(formData.expiryDate);
      if (expDate <= today) {
        newErrors.expiryDate =
          "La fecha de vencimiento debe ser posterior a hoy";
      }
    }
    if (!formData.proveedorId) {
      newErrors.proveedorId = "Debe seleccionar un proveedor";
    }
    if (formData.price <= 0) {
      newErrors.price = "El precio unitario debe ser mayor que cero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProvider = () => {
    const newErrors: Record<string, string> = {};
    if (!providerData.nombreEmpresa.trim())
      newErrors.nombreEmpresa = "El nombre de la empresa es requerido";
    if (!providerData.contacto.trim())
      newErrors.contacto = "El contacto es requerido";
    if (!providerData.telefono.trim())
      newErrors.telefono = "El teléfono es requerido";
    if (!providerData.correo.trim())
      newErrors.correo = "El correo es requerido";
    if (!providerData.direccion.trim())
      newErrors.direccion = "La dirección es requerida";
    if (!providerData.condicionesPago.trim())
      newErrors.condicionesPago = "Las condiciones de pago son requeridas";
    setProviderErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateProvider = async () => {
    if (!validateProvider()) return;
    setIsSavingProvider(true);
    try {
      const response = await createProveedor(providerData);
      await fetchProviders();
      const newProviderId = response.data?.id;
      if (newProviderId) {
        setFormData((prev) => ({ ...prev, proveedorId: newProviderId }));
      }
      setProviderData({
        nombreEmpresa: "",
        contacto: "",
        telefono: "",
        correo: "",
        direccion: "",
        condicionesPago: "",
      });
      setProviderErrors({});
      setIsProviderFormOpen(false);
      if (errors.proveedorId) setErrors({ ...errors, proveedorId: "" });
    } catch (error: any) {
      setProviderErrors({
        general:
          error.response?.data?.message || "No se pudo crear el proveedor",
      });
    } finally {
      setIsSavingProvider(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        proveedorId: formData.proveedorId,
        codigo: formData.codigo.trim(),
        nombreProducto: formData.name.trim(),
        descripcion: formData.descripcion.trim(),
        presentacion: formData.presentacion.trim(),
        unidadMedida: formData.unidadMedida,
        tipo: formData.category,
        stockActual: formData.stock,
        stockMinimo: formData.minStock,
        fechaVencimiento: formData.expiryDate,
        precioUnitario: Number(formData.price),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-[#0A2540]">
            Registrar Insumo / Medicamento
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Código *
              </label>
              <input
                type="text"
                aria-label="Código"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.codigo ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.codigo}
                onChange={(e) => {
                  setFormData({ ...formData, codigo: e.target.value });
                  if (errors.codigo) setErrors({ ...errors, codigo: "" });
                }}
              />
              {errors.codigo && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.codigo}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Nombre del Producto *
              </label>
              <input
                type="text"
                aria-label="Nombre del Producto"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.name ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Categoría *
              </label>
              <select
                aria-label="Categoría"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ItemCategory,
                  })
                }
              >
                <option value="Medicamento">Medicamento</option>
                <option value="Vacuna">Vacuna</option>
                <option value="Insumo">Insumo</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Presentación
              </label>
              <input
                type="text"
                aria-label="Presentación"
                placeholder="Ej: Caja, Frasco, Blister"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all border-slate-300 focus:ring-2 focus:ring-[#A8DADC]`}
                value={formData.presentacion}
                onChange={(e) =>
                  setFormData({ ...formData, presentacion: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">
              Descripción
            </label>
            <textarea
              aria-label="Descripción"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all border-slate-300 focus:ring-2 focus:ring-[#A8DADC]`}
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Unidad de Medida *
              </label>
              <select
                aria-label="Unidad de Medida"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.unidadMedida ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.unidadMedida}
                onChange={(e) => {
                  setFormData({ ...formData, unidadMedida: e.target.value });
                  if (errors.unidadMedida)
                    setErrors({ ...errors, unidadMedida: "" });
                }}
              >
                <option value="ml">Mililitros (ml)</option>
                <option value="mg">Miligramos (mg)</option>
                <option value="g">Gramos (g)</option>
                <option value="unidades">Unidades</option>
                <option value="cajas">Cajas</option>
              </select>
              {errors.unidadMedida && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.unidadMedida}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Stock Inicial *
              </label>
              <input
                type="number"
                aria-label="Stock Inicial"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.stock ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.stock}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  });
                  if (errors.stock) setErrors({ ...errors, stock: "" });
                }}
              />
              {errors.stock && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Stock Mínimo *
              </label>
              <input
                type="number"
                aria-label="Stock Mínimo"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.minStock ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.minStock}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    minStock: parseInt(e.target.value) || 0,
                  });
                  if (errors.minStock) setErrors({ ...errors, minStock: "" });
                }}
              />
              {errors.minStock && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.minStock}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Fecha de Vencimiento *
              </label>
              <input
                type="date"
                aria-label="Fecha de Vencimiento"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.expiryDate ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.expiryDate}
                onChange={(e) => {
                  setFormData({ ...formData, expiryDate: e.target.value });
                  if (errors.expiryDate)
                    setErrors({ ...errors, expiryDate: "" });
                }}
              />
              {errors.expiryDate && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.expiryDate}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                Precio Unitario *
              </label>
              <input
                type="number"
                aria-label="Precio Unitario"
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${errors.price ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
                value={formData.price}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  });
                  if (errors.price) setErrors({ ...errors, price: "" });
                }}
              />
              {errors.price && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-slate-700">
                Proveedor *
              </label>
              <button
                type="button"
                onClick={() => setIsProviderFormOpen((prev) => !prev)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900"
              >
                {isProviderFormOpen ? "Cerrar formulario" : "+ Crear proveedor"}
              </button>
            </div>
            <select
              aria-label="Proveedor"
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all bg-white ${errors.proveedorId ? "border-red-400 focus:ring-2 focus:ring-red-400 bg-red-50" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
              value={formData.proveedorId}
              onChange={(e) => {
                setFormData({ ...formData, proveedorId: e.target.value });
                if (errors.proveedorId)
                  setErrors({ ...errors, proveedorId: "" });
              }}
              disabled={isLoadingProviders}
            >
              <option value="">Seleccione un proveedor...</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.nombreEmpresa}
                </option>
              ))}
            </select>
            {errors.proveedorId && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> {errors.proveedorId}
              </p>
            )}

            {isProviderFormOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-slate-200 pt-4">
                {providerErrors.general && (
                  <p className="md:col-span-2 text-xs text-red-600 font-semibold">
                    {providerErrors.general}
                  </p>
                )}
                <ProviderInput
                  label="Empresa *"
                  value={providerData.nombreEmpresa}
                  error={providerErrors.nombreEmpresa}
                  onChange={(value) =>
                    setProviderData({ ...providerData, nombreEmpresa: value })
                  }
                />
                <ProviderInput
                  label="Contacto *"
                  value={providerData.contacto}
                  error={providerErrors.contacto}
                  onChange={(value) =>
                    setProviderData({ ...providerData, contacto: value })
                  }
                />
                <ProviderInput
                  label="Teléfono *"
                  value={providerData.telefono}
                  error={providerErrors.telefono}
                  onChange={(value) =>
                    setProviderData({ ...providerData, telefono: value })
                  }
                />
                <ProviderInput
                  label="Correo *"
                  value={providerData.correo}
                  error={providerErrors.correo}
                  onChange={(value) =>
                    setProviderData({ ...providerData, correo: value })
                  }
                  type="email"
                />
                <ProviderInput
                  label="Dirección *"
                  value={providerData.direccion}
                  error={providerErrors.direccion}
                  onChange={(value) =>
                    setProviderData({ ...providerData, direccion: value })
                  }
                />
                <ProviderInput
                  label="Condiciones de pago *"
                  value={providerData.condicionesPago}
                  error={providerErrors.condicionesPago}
                  onChange={(value) =>
                    setProviderData({ ...providerData, condicionesPago: value })
                  }
                  placeholder="Ej: Crédito 30 días"
                />
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCreateProvider}
                    disabled={isSavingProvider}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isSavingProvider
                      ? "Guardando proveedor..."
                      : "Guardar proveedor"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors shadow-lg shadow-[#0A2540]/20 flex items-center gap-2"
              disabled={isLoadingProviders || providers.length === 0}
            >
              <Package size={18} />
              Guardar en Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProviderInput({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm outline-none ${error ? "border-red-400 focus:ring-2 focus:ring-red-400" : "border-slate-300 focus:ring-2 focus:ring-[#A8DADC]"}`}
      />
      {error && (
        <p className="text-[10px] text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
}
