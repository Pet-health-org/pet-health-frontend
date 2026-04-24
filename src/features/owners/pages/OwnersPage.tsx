import { OwnerList } from '../components/OwnerList';
import { Owner } from '../types';

// Mock data for initial visualization
const mockOwners: Owner[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '555-0123',
    address: 'Calle Falsa 123, Ciudad',
    registrationDate: '2023-01-15T10:00:00Z'
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'Gómez',
    email: 'maria.gomez@example.com',
    phone: '555-0124',
    address: 'Avenida Siempre Viva 742, Ciudad',
    registrationDate: '2023-02-20T14:30:00Z'
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.r@example.com',
    phone: '555-0125',
    address: 'Boulevard de los Sueños Rotos, Ciudad',
    registrationDate: '2023-03-05T09:15:00Z'
  }
];

export function OwnersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540]">Propietarios</h1>
        <p className="text-slate-500">Gestión de dueños de mascotas registrados en la clínica.</p>
      </div>

      <OwnerList owners={mockOwners} />
    </div>
  );
}
