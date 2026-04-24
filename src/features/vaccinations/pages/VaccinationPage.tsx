import { useState } from 'react';
import { useVaccines } from '../hooks/useVaccines';
import { usePets } from '../../pets/hooks/usePets';
import { useNotify } from '../../../context/NotificationContext';
import { VaccineForm } from '../components/VaccineForm';
import { AlertCircle, Plus, Syringe, Search, ChevronRight } from 'lucide-react';
import { Pet } from '../../pets/types';

export function VaccinationPage() {
  const { pets } = usePets();
  const { records, getUpcomingVaccines, addRecord, isLoading } = useVaccines();
  const { notify } = useNotify();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const upcoming = getUpcomingVaccines();
  
  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecord = (data: any) => {
    addRecord(data);
    notify('success', 'Vacuna Registrada', 'La aplicación ha sido registrada correctamente.');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Gestión de Vacunación</h1>
          <p className="text-slate-500">Control de esquemas y recordatorios de vacunas.</p>
        </div>
      </div>

      {/* Alerts Section (HU-15) */}
      {upcoming.length > 0 && (
        <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm shadow-amber-100/50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#0A2540]">Recordatorios de Vacunación</h3>
              <p className="text-xs text-slate-500">Mascotas con refuerzos programados para los próximos 15 días.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(r => {
              const pet = pets.find(p => p.id === r.petId);
              return (
                <div key={r.id} className="group bg-slate-50/50 hover:bg-white p-4 rounded-xl border border-slate-100 hover:border-amber-200 transition-all flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm">
                      <Syringe size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0A2540]">{r.vaccineName}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Paciente: <span className="text-slate-700">{pet?.name}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-amber-600">{new Date(r.nextBoosterDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Vence</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pet Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-[#0A2540] mb-3">Buscar Mascota</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Nombre de mascota..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredPets.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedPet(p)}
                  className={`w-full p-3 rounded-lg border text-left transition-all flex justify-between items-center group ${selectedPet?.id === p.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div>
                    <p className="font-bold text-sm text-[#0A2540]">{p.name}</p>
                    <p className="text-[10px] text-slate-500">{p.species} • {p.breed}</p>
                  </div>
                  <ChevronRight size={16} className={`text-slate-300 group-hover:text-blue-400 transition-colors ${selectedPet?.id === p.id ? 'text-blue-500' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pet Vaccination Detail */}
        <div className="lg:col-span-2">
          {selectedPet ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#A8DADC]/20 text-[#0A2540] rounded-full flex items-center justify-center">
                    <Syringe size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A2540]">Esquema de {selectedPet.name}</h2>
                    <p className="text-sm text-slate-500">Historial completo de aplicaciones</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Registrar Vacuna
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3 font-bold">Vacuna</th>
                      <th className="p-3 font-bold">Fecha Aplicación</th>
                      <th className="p-3 font-bold">Lote</th>
                      <th className="p-3 font-bold">Próximo Refuerzo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.filter(r => r.petId === selectedPet.id).length > 0 ? (
                      records.filter(r => r.petId === selectedPet.id).map(r => (
                        <tr key={r.id} className="text-sm">
                          <td className="p-3 font-medium text-[#0A2540]">{r.vaccineName}</td>
                          <td className="p-3 text-slate-600">{new Date(r.applicationDate).toLocaleDateString()}</td>
                          <td className="p-3 text-slate-500 font-mono text-xs">{r.batchNumber}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${new Date(r.nextBoosterDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                              {new Date(r.nextBoosterDate).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-400 italic">
                          No hay vacunas registradas para esta mascota.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400">
              <Syringe size={48} className="mb-4 opacity-20" />
              <p className="font-medium text-lg">Seleccione una mascota</p>
              <p className="text-sm">Para ver y gestionar su historial de vacunación.</p>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && selectedPet && (
        <VaccineForm 
          pet={selectedPet}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddRecord}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
}
