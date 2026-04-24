import { useState } from 'react';
import { OwnerList } from '../components/OwnerList';
import { OwnerForm } from '../components/OwnerForm';
import { useOwners } from '../hooks/useOwners';
import { useNotify } from '../../../context/NotificationContext';
import { Owner } from '../types';

export function OwnersPage() {
  const { owners, isLoading, addOwner, updateOwner, deleteOwner } = useOwners();
  const { notify } = useNotify();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | undefined>(undefined);

  const handleAdd = () => {
    setSelectedOwner(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Omit<Owner, 'id' | 'registrationDate'>) => {
    if (selectedOwner) {
      updateOwner(selectedOwner.id, data);
      notify('success', 'Actualizado', 'La información del propietario ha sido actualizada.');
    } else {
      addOwner(data);
      notify('success', 'Registrado', 'El nuevo propietario ha sido registrado exitosamente.');
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este propietario?')) {
      deleteOwner(id);
      notify('info', 'Eliminado', 'El registro del propietario ha sido eliminado.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540]">Propietarios</h1>
        <p className="text-slate-500">Gestión de dueños de mascotas registrados en la clínica.</p>
      </div>

      <OwnerList 
        owners={owners} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <OwnerForm 
          owner={selectedOwner}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
}
