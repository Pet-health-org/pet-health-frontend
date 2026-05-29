import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, ShoppingCart, Info } from 'lucide-react';
import { findBajoStock } from '../../../services/inventario.service';
import { useNotify } from '../../../context/NotificationContext';

type InventarioItem = {
  id: string;
  nombreProducto: string;
  stockActual: number;
  stockMinimo: number;
  proveedor?: {
    nombre: string;
  };
};

export function LowStockAlerts() {
  const [items, setItems] = useState<InventarioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotify();

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await findBajoStock();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching low stock:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLowStock();
  }, []);

  const handleOrder = (nombreProducto: string) => {
    notify('success', 'Orden Generada', `Se ha generado una orden de compra para: ${nombreProducto}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-slate-100 rounded"></div>
          <div className="h-16 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Ocultar si no hay alertas
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden mb-6 animate-in slide-in-from-top-2">
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Alertas de Inventario</h3>
            <p className="text-xs text-red-700 font-medium">{items.length} productos necesitan reposición urgente</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item) => {
          const isZero = item.stockActual === 0;
          const statusColor = isZero ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200';
          const indicatorColor = isZero ? 'bg-red-500' : 'bg-amber-500';

          return (
            <div key={item.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-2 h-2 mt-2 rounded-full shadow-sm ${indicatorColor}`}></div>
                <div>
                  <h4 className="font-bold text-[#0A2540]">{item.nombreProducto}</h4>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2 items-center">
                    <span className="flex items-center gap-1"><Package size={12} /> Proveedor: <span className="font-medium text-slate-700">{item.proveedor?.nombre || 'Desconocido'}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto ml-6 sm:ml-0">
                <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold flex flex-col items-center min-w-[100px] ${statusColor}`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-80 mb-0.5">Stock</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg leading-none">{item.stockActual}</span>
                    <span className="text-xs opacity-70">/ {item.stockMinimo} min</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOrder(item.nombreProducto)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-[#0A2540] hover:text-white hover:border-[#0A2540] transition-colors flex items-center justify-center gap-2 shadow-sm group"
                >
                  <ShoppingCart size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                  Generar Orden
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
