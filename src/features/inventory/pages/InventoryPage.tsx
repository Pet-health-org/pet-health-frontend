import { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useNotify } from '../../../context/NotificationContext';
import { InventoryForm } from '../components/InventoryForm';
import { Package, Plus, AlertTriangle, Search, Filter, History } from 'lucide-react';

export function InventoryPage() {
  const { items, movements, addItem, getLowStockItems } = useInventory();
  const { notify } = useNotify();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const lowStock = getLowStockItems();

  const handleAddItem = (data: any) => {
    addItem(data);
    notify('success', 'Inventario Actualizado', 'El producto ha sido registrado correctamente.');
    setIsFormOpen(false);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Gestión de Inventario</h1>
          <p className="text-slate-500">Control de stock de medicamentos, vacunas e insumos.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2 shadow-lg shadow-[#0A2540]/10"
        >
          <Plus size={20} />
          Registrar Producto
        </button>
      </div>

      {/* Low Stock Alerts (HU-18) */}
      {lowStock.length > 0 && (
        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm shadow-red-100/50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#0A2540]">Alertas de Stock Bajo</h3>
              <p className="text-xs text-slate-500">Productos que han alcanzado o superado el stock mínimo de seguridad.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStock.map(item => (
              <div key={item.id} className="group bg-slate-50/50 hover:bg-white p-4 rounded-xl border border-slate-100 hover:border-red-200 transition-all flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0A2540]">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-tighter">Stock: {item.stock}</span>
                      <span className="text-[10px] text-slate-400">Min: {item.minStock}</span>
                    </div>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-[#0A2540] hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] transition-all shadow-sm">
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por código o nombre..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Filter size={18} />
              Filtrar
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <History size={18} />
              Movimientos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Stock Actual</th>
                <th className="p-4 font-semibold">Vencimiento</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{item.code}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.category === 'Medicamento' ? 'bg-blue-100 text-blue-700' : 
                      item.category === 'Vacuna' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm font-bold ${item.stock <= item.minStock ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.stock} {item.unit}
                    </div>
                    <div className="text-[10px] text-slate-400">Min: {item.minStock}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-bold text-[#0A2540] hover:underline">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <InventoryForm 
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddItem}
        />
      )}
    </div>
  );
}
