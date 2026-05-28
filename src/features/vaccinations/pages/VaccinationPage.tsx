import { useState } from 'react';
import { useVaccines } from '../hooks/useVaccines';
import { usePets } from '../../pets/hooks/usePets';
import { useOwners } from '../../owners/hooks/useOwners';
import { useNotify } from '../../../context/NotificationContext';
import { VaccineForm } from '../components/VaccineForm';
import { AlertCircle, Plus, Syringe, Search, ChevronRight, Bell, Filter, Calendar } from 'lucide-react';
import { Pet } from '../../pets/types';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';
import { ALERT_DAYS_THRESHOLD } from '../types';

export function VaccinationPage() {
  const { pets } = usePets();
  const { owners } = useOwners();
  const { records, getUpcomingVaccines, addRecord, isLoading } = useVaccines();
  const { notify } = useNotify();

  const [activeTab, setActiveTab] = useState<'panel' | 'gestion'>('panel');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Search and filters for Panel
  const [panelSearch, setPanelSearch] = useState('');
  const [panelSpeciesFilter, setPanelSpeciesFilter] = useState('');
  const [panelDateFilter, setPanelDateFilter] = useState('');

  // Search for Gestion
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

  const handleNotifyOwner = (petName: string, ownerName: string) => {
    notify('success', 'Notificación Enviada', `Se ha enviado el recordatorio a ${ownerName} para la mascota ${petName}.`);
  };

  // Filter upcoming vaccines for the panel
  const filteredUpcoming = upcoming.filter(r => {
    const pet = pets.find(p => p.id === r.petId);
    if (!pet) return false;
    
    const owner = owners.find(o => o.id === pet.ownerId);
    const searchMatch = pet.name.toLowerCase().includes(panelSearch.toLowerCase()) || 
                       (owner && `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(panelSearch.toLowerCase()));
    const speciesMatch = panelSpeciesFilter ? pet.species === panelSpeciesFilter : true;
    
    // date match (very simple implementation for specific months if typed, or just visual)
    const dateMatch = panelDateFilter ? new Date(r.nextBoosterDate).toISOString().startsWith(panelDateFilter) : true;

    return searchMatch && speciesMatch && dateMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Gestión de Vacunación</h1>
          <p className="text-slate-500">Control de esquemas y recordatorios de vacunas.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button 
          className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'panel' ? 'border-b-2 border-[#0A2540] text-[#0A2540]' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('panel')}
        >
          Panel de Pendientes
        </button>
        <button 
          className={`pb-3 font-semibold text-sm transition-colors ${activeTab === 'gestion' ? 'border-b-2 border-[#0A2540] text-[#0A2540]' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('gestion')}
        >
          Esquemas por Mascota
        </button>
      </div>

      {activeTab === 'panel' && (
        <div className="space-y-4 animate-in slide-in-from-right-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por mascota o propietario..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none text-sm"
                value={panelSearch}
                onChange={(e) => setPanelSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-[#A8DADC]"
                value={panelSpeciesFilter}
                onChange={(e) => setPanelSpeciesFilter(e.target.value)}
              >
                <option value="">Todas las Especies</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otros">Otros</option>
              </select>
              <input 
                type="month" 
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-[#A8DADC]"
                value={panelDateFilter}
                onChange={(e) => setPanelDateFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="p-4 font-bold">Mascota</th>
                    <th className="p-4 font-bold">Especie</th>
                    <th className="p-4 font-bold">Propietario</th>
                    <th className="p-4 font-bold">Vacuna Pendiente</th>
                    <th className="p-4 font-bold">Fecha Vencimiento</th>
                    <th className="p-4 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUpcoming.length > 0 ? (
                    filteredUpcoming.map(r => {
                      const pet = pets.find(p => p.id === r.petId);
                      const owner = pet ? owners.find(o => o.id === pet.ownerId) : null;
                      const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Desconocido';
                      
                      const boosterDate = new Date(r.nextBoosterDate);
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const isExpired = boosterDate < today;
                      
                      return (
                        <tr key={r.id} className={`text-sm hover:bg-slate-50 transition-colors ${isExpired ? 'bg-red-50/50' : 'bg-amber-50/30'}`}>
                          <td className="p-4 font-bold text-[#0A2540]">{pet?.name || 'Desconocido'}</td>
                          <td className="p-4 text-slate-600">{pet?.species || 'N/A'}</td>
                          <td className="p-4 text-slate-600">{ownerName}</td>
                          <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                            <Syringe size={14} className="text-slate-400" />
                            {r.vaccineName}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${isExpired ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                              {boosterDate.toLocaleDateString()} {isExpired ? '(Vencida)' : '(Próxima)'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleNotifyOwner(pet?.name || 'Mascota', ownerName)}
                              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm mx-auto"
                            >
                              <Bell size={14} />
                              Notificar
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400 italic">
                        No hay vacunas pendientes o vencidas con estos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gestion' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-left-4">
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
      )}

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
