import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { getPropietarioById } from '../../../services/propietarios.service';
import { Owner } from '../types';

export function OwnerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await getPropietarioById(id as string);
        const user = response.data;
        const nameParts = (user.nombreCompleto || '').split(' ');
        const firstName = nameParts[0] || user.username || 'Sin nombre';
        const lastName = nameParts.slice(1).join(' ') || '';

        setOwner({
          id: user.id,
          firstName: firstName,
          lastName: lastName,
          identification: user.numeroIdentificacion || 'N/A',
          email: user.email,
          phone: user.telefono || 'N/A',
          address: user.direccion || 'N/A',
          registrationDate: user.createdAt,
        });
      } catch (error) {
        console.error('Error fetching owner profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchOwner();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando perfil...</div>;
  if (!owner) return <div className="p-8 text-center text-red-500">Propietario no encontrado</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-[#0A2540] transition-colors"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-8">
          <div className="w-24 h-24 bg-[#E0F2F1] rounded-full flex items-center justify-center text-[#0A2540]">
            <User size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0A2540]">{owner.firstName} {owner.lastName}</h1>
            <p className="text-slate-500 mt-1">Perfil del Propietario</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Información de Contacto</h3>
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="text-slate-400" size={20} />
              <span>{owner.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="text-slate-400" size={20} />
              <span>{owner.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="text-slate-400" size={20} />
              <span>{owner.address}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Documentación</h3>
            <div className="flex items-center gap-3 text-slate-600">
              <CreditCard className="text-slate-400" size={20} />
              <span>{owner.identification}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
