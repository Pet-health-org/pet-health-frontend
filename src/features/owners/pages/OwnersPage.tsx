import { useState } from 'react';
import { OwnerList } from '../components/OwnerList';
import { OwnerForm } from '../components/OwnerForm';
import { useOwners } from '../hooks/useOwners';
import { useNotify } from '../../../context/NotificationContext';
import { Owner } from '../types';
import Swal from 'sweetalert2';

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

  const handleSubmit = async (data: Omit<Owner, 'id' | 'registrationDate'>) => {
    try {
      if (selectedOwner) {
        await updateOwner(selectedOwner.id, data);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'La información del propietario ha sido actualizada.',
          confirmButtonColor: '#0A2540'
        });
      } else {
        await addOwner(data);
        Swal.fire({
          icon: 'success',
          title: '¡Registrado!',
          text: 'El nuevo propietario ha sido registrado exitosamente.',
          confirmButtonColor: '#0A2540'
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar la solicitud.',
        confirmButtonColor: '#0A2540'
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteOwner(id);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El registro del propietario ha sido eliminado.',
          confirmButtonColor: '#0A2540'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al eliminar el propietario.',
          confirmButtonColor: '#0A2540'
        });
      }
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
