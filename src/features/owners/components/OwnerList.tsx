import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Owner } from '../types';

interface OwnerListProps {
  owners: Owner[];
}

export function OwnerList({ owners }: OwnerListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOwners = owners.filter(o => 
    `${o.firstName} ${o.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o teléfono..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors flex items-center justify-center gap-2">
          <Plus size={20} />
          Nuevo Propietario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Nombre Completo</th>
              <th className="p-4 font-semibold">Contacto</th>
              <th className="p-4 font-semibold hidden md:table-cell">Dirección</th>
              <th className="p-4 font-semibold hidden lg:table-cell">Fecha Registro</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredOwners.length > 0 ? (
              filteredOwners.map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{owner.firstName} {owner.lastName}</div>
                    <div className="text-xs text-slate-500 md:hidden">{owner.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-600">{owner.phone}</div>
                    <div className="text-xs text-slate-500 hidden md:block">{owner.email}</div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-sm text-slate-600">
                    {owner.address}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-slate-600">
                    {new Date(owner.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-1.5 text-slate-400 hover:text-[#0A2540] hover:bg-slate-100 rounded transition-colors" title="Ver detalles">
                      <Eye size={18} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No se encontraron propietarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500">
        <div>Mostrando {filteredOwners.length} de {owners.length} registros</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">Anterior</button>
          <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
