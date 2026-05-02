import { useState } from 'react';
import { PetList } from '../components/PetList';
import { PetForm } from '../components/PetForm';
import { usePets } from '../hooks/usePets';
import { useOwners } from '../../owners/hooks/useOwners';
import { useNotify } from '../../../context/NotificationContext';
import { Pet } from '../types';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

export function PetsPage() {
  const { pets, isLoading: isPetsLoading, addPet, updatePet, deletePet } = usePets();
  const { owners } = useOwners();
  const { notify } = useNotify();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>(undefined);

  const handleAdd = () => {
    setSelectedPet(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Omit<Pet, 'id' | 'registrationDate'>) => {
    if (selectedPet) {
      updatePet(selectedPet.id, data);
      notify('success', 'Actualizado', 'La información de la mascota ha sido actualizada.');
    } else {
      addPet(data);
      notify('success', 'Registrada', 'La nueva mascota ha sido registrada exitosamente.');
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta mascota?')) {
      deletePet(id);
      notify('info', 'Eliminada', 'El registro de la mascota ha sido eliminado.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert moduleName="Mascotas" />
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540]">Mascotas</h1>
        <p className="text-slate-500">Gestión de pacientes animales registrados en la clínica.</p>
      </div>

      <PetList 
        pets={pets} 
        owners={owners}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <PetForm 
          pet={selectedPet}
          owners={owners}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isPetsLoading}
        />
      )}
    </div>
  );
}
