import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Dog, Cat, Bird, HelpCircle } from 'lucide-react';
import { Pet, Species } from '../types';
import { Owner } from '../../owners/types';

interface PetListProps {
  pets: Pet[];
  owners: Owner[];
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function PetList({ pets, owners, onEdit, onDelete, onAdd }: PetListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find(o => o.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Desconocido';
  };

  const getSpeciesIcon = (species: Species) => {
    switch (species) {
      case 'Perro': return <Dog size={18} className="text-blue-500" />;
      case 'Gato': return <Cat size={18} className="text-purple-500" />;
      case 'Ave': return <Bird size={18} className="text-amber-500" />;
      default: return <HelpCircle size={18} className="text-slate-400" />;
    }
  };

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getOwnerName(p.ownerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, raza o dueño..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={onAdd}
          className="w-full sm:w-auto px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Nueva Mascota
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Mascota</th>
              <th className="p-4 font-semibold">Especie / Raza</th>
              <th className="p-4 font-semibold">Propietario</th>
              <th className="p-4 font-semibold">Peso</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <tr key={pet.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        {getSpeciesIcon(pet.species)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{pet.name}</div>
                        <div className="text-xs text-slate-500">{pet.sex}, {pet.color}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="font-medium">{pet.species}</div>
                    <div className="text-xs">{pet.breed}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {getOwnerName(pet.ownerId)}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {pet.weight} kg
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => onEdit(pet)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(pet.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No se encontraron mascotas que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200 text-sm text-slate-500">
        Mostrando {filteredPets.length} de {pets.length} registros
      </div>
    </div>
  );
}
