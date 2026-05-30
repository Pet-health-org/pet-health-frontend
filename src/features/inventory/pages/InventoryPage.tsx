import { useMemo, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { useNotify } from "../../../context/NotificationContext";
import { InventoryForm } from "../components/InventoryForm";
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  ShoppingCart,
  X,
} from "lucide-react";
import { InventoryItem } from "../types";

export function InventoryPage() {
  const { items, addItem, getLowStockItems, recordMovement } = useInventory();
  const { notify } = useNotify();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"" | "low" | "available">("");
  const [expiryFilter, setExpiryFilter] = useState<"" | "expired" | "soon">("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [isRestocking, setIsRestocking] = useState(false);

  const lowStock = getLowStockItems();

  const handleAddItem = async (data: any) => {
    await addItem(data);
    notify(
      "success",
      "Inventario Actualizado",
      "El producto ha sido registrado correctamente.",
    );
    setIsFormOpen(false);
  };

  const openRestock = (item: InventoryItem) => {
    setRestockItem(item);
    setRestockQuantity(Math.max(item.minStock - item.stock, 1));
  };

  const handleRestock = async () => {
    if (!restockItem || restockQuantity <= 0) return;
    setIsRestocking(true);
    try {
      await recordMovement(
        restockItem.id,
        "Entrada",
        restockQuantity,
        "Reabastecimiento desde inventario",
      );
      notify(
        "success",
        "Producto reabastecido",
        `Se agregaron ${restockQuantity} unidades a ${restockItem.name}.`,
      );
      setRestockItem(null);
      setRestockQuantity(1);
    } catch (error) {
      notify("error", "Error", "No se pudo reabastecer el producto.");
    } finally {
      setIsRestocking(false);
    }
  };

  const filteredItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const soon = new Date(today);
    soon.setDate(soon.getDate() + 30);

    return items.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = categoryFilter
        ? item.category === categoryFilter
        : true;
      const stockMatch =
        stockFilter === "low"
          ? item.stock <= item.minStock
          : stockFilter === "available"
            ? item.stock > item.minStock
            : true;

      let expiryMatch = true;
      if (expiryFilter && item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);
        expiryMatch =
          expiryFilter === "expired"
            ? expiryDate < today
            : expiryDate >= today && expiryDate <= soon;
      } else if (expiryFilter) {
        expiryMatch = false;
      }

      return searchMatch && categoryMatch && stockMatch && expiryMatch;
    });
  }, [items, searchTerm, categoryFilter, stockFilter, expiryFilter]);

  const clearFilters = () => {
    setCategoryFilter("");
    setStockFilter("");
    setExpiryFilter("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            Gestión de Inventario
          </h1>
          <p className="text-slate-500">
            Control de stock de medicamentos, vacunas e insumos.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2 shadow-lg shadow-[#0A2540]/10"
        >
          <Plus size={20} />
          Registrar Producto
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm shadow-red-100/50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#0A2540]">
                Alertas de Stock Bajo
              </h3>
              <p className="text-xs text-slate-500">
                Productos que han alcanzado o superado el stock mínimo de
                seguridad.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-50/50 hover:bg-white p-4 rounded-xl border border-slate-100 hover:border-red-200 transition-all flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0A2540]">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-tighter">
                        Stock: {item.stock}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Min: {item.minStock}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openRestock(item)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-[#0A2540] hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] transition-all shadow-sm flex items-center gap-1"
                >
                  <ShoppingCart size={12} />
                  REABASTECER
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por código, nombre o proveedor..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Filter size={18} />
            Filtrar
          </button>
        </div>

        {isFilterOpen && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#A8DADC]"
            >
              <option value="">Todas las categorías</option>
              <option value="Medicamento">Medicamentos</option>
              <option value="Vacuna">Vacunas</option>
              <option value="Insumo">Insumos</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#A8DADC]"
            >
              <option value="">Todo el stock</option>
              <option value="low">Stock bajo</option>
              <option value="available">Stock suficiente</option>
            </select>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#A8DADC]"
            >
              <option value="">Todos los vencimientos</option>
              <option value="expired">Vencidos</option>
              <option value="soon">Vencen en 30 días</option>
            </select>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-600 bg-white hover:bg-slate-100"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Proveedor</th>
                <th className="p-4 font-semibold">Stock Actual</th>
                <th className="p-4 font-semibold">Vencimiento</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {item.code}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.category === "Medicamento"
                            ? "bg-blue-100 text-blue-700"
                            : item.category === "Vacuna"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {item.provider || "N/A"}
                    </td>
                    <td className="p-4">
                      <div
                        className={`text-sm font-bold ${item.stock <= item.minStock ? "text-red-600" : "text-slate-700"}`}
                      >
                        {item.stock} {item.unit || "u"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Min: {item.minStock}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString()
                        : "Sin fecha"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-sm font-bold text-[#0A2540] hover:underline flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Ver detalles
                        </button>
                        <button
                          onClick={() => openRestock(item)}
                          className="text-sm font-bold text-emerald-700 hover:underline"
                        >
                          Reabastecer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    No hay productos con los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <InventoryForm
          items={items}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddItem}
        />
      )}

      {selectedItem && (
        <InventoryDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {restockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-[#0A2540]">
                Reabastecer producto
              </h2>
              <button
                onClick={() => setRestockItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-bold text-[#0A2540]">{restockItem.name}</p>
                <p className="text-sm text-slate-500">
                  Stock actual: {restockItem.stock} {restockItem.unit || "u"}
                </p>
                <p className="text-sm text-slate-500">
                  Stock mínimo: {restockItem.minStock}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">
                  Cantidad a agregar *
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) =>
                    setRestockQuantity(Number(e.target.value) || 1)
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#A8DADC]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setRestockItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRestock}
                  disabled={isRestocking || restockQuantity <= 0}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isRestocking ? "Guardando..." : "Confirmar reabastecimiento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryDetailsModal({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-[#0A2540]">
            Detalle de producto
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Detail label="Código" value={item.code} />
          <Detail label="Nombre" value={item.name} />
          <Detail label="Categoría" value={item.category} />
          <Detail label="Proveedor" value={item.provider || "N/A"} />
          <Detail label="Presentación" value={item.presentation || "N/A"} />
          <Detail label="Unidad" value={item.unit || "u"} />
          <Detail label="Stock actual" value={`${item.stock}`} />
          <Detail label="Stock mínimo" value={`${item.minStock}`} />
          <Detail
            label="Vencimiento"
            value={
              item.expiryDate
                ? new Date(item.expiryDate).toLocaleDateString()
                : "Sin fecha"
            }
          />
          <Detail
            label="Precio unitario"
            value={item.price ? `$${item.price}` : "N/A"}
          />
          <div className="sm:col-span-2">
            <Detail
              label="Descripción"
              value={item.description || "Sin descripción"}
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
        {label}
      </p>
      <p className="font-semibold text-slate-700 break-words">{value}</p>
    </div>
  );
}
