import { useState } from 'react';
import { ClinicalHistoryView } from '../components/ClinicalHistoryView';
import { ConsultationForm } from '../components/ConsultationForm';
import { useConsultations } from '../hooks/useConsultations';
import { usePets } from '../../pets/hooks/usePets';
import { useNotify } from '../../../context/NotificationContext';
import { Search, FileSearch } from 'lucide-react';
import { Pet } from '../../pets/types';
import { Consultation } from '../types';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

export function ClinicalHistoryPage() {
  const { pets } = usePets();
  const { getPetHistory, addConsultation, isLoading } = useConsultations();
  const { notify } = useNotify();
  
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredPets = pets.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setSearchTerm('');
  };

  const handleNewConsultation = () => {
    setIsFormOpen(true);
  };

  const handleSubmitConsultation = (data: Omit<Consultation, 'id' | 'registrationDate'>) => {
    addConsultation(data);
    notify('success', 'Consulta Registrada', 'La atención clínica ha sido guardada en la historia del paciente.');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert moduleName="Historia Clínica" />
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540]">Historial Clínico</h1>
        <p className="text-slate-500">Consulta y registro de atenciones veterinarias.</p>
      </div>

      {!selectedPet ? (
        <div className="max-w-2xl mx-auto space-y-6 pt-12">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#A8DADC]/20 text-[#0A2540] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSearch size={32} />
            </div>
            <h2 className="text-xl font-bold text-[#0A2540]">Buscar Paciente</h2>
            <p className="text-slate-500">Ingrese el nombre o ID de la mascota para ver su historia.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text"
              placeholder="Buscar por nombre o ID de mascota..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#A8DADC] outline-none text-lg transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg animate-in slide-in-from-top-2">
              {filteredPets.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredPets.map(pet => (
                    <button 
                      key={pet.id}
                      onClick={() => handleSelectPet(pet)}
                      className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-[#0A2540]">{pet.name}</p>
                        <p className="text-sm text-slate-500">{pet.species} • {pet.breed}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-400">ID: {pet.id}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No se encontraron mascotas con ese nombre.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedPet(null)}
            className="text-sm font-medium text-slate-500 hover:text-[#0A2540] flex items-center gap-1 transition-colors"
          >
            ← Volver a la búsqueda
          </button>
          
          <ClinicalHistoryView 
            pet={selectedPet}
            history={getPetHistory(selectedPet.id)}
            onNewConsultation={handleNewConsultation}
          />
        </div>
      )}

      {isFormOpen && selectedPet && (
        <ConsultationForm 
          pet={selectedPet}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitConsultation}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
}
