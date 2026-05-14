import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dog, Cat, Bird, HelpCircle, Activity, Info, Calendar, User } from 'lucide-react';
import { getMascotaById } from '../../../services/mascotas.service';

export function PetProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await getMascotaById(id as string);
        setPet(response.data);
      } catch (error) {
        console.error('Error fetching pet profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPet();
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando perfil de la mascota...</div>;
  if (!pet) return <div className="p-8 text-center text-red-500">Mascota no encontrada</div>;

  const speciesName = pet.raza?.especie?.nombre || 'Desconocido';
  
  const getSpeciesIcon = () => {
    switch (speciesName) {
      case 'Perro': return <Dog size={48} className="text-[#0A2540]" />;
      case 'Gato': return <Cat size={48} className="text-[#0A2540]" />;
      case 'Ave': return <Bird size={48} className="text-[#0A2540]" />;
      default: return <HelpCircle size={48} className="text-[#0A2540]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/pets')}
        className="flex items-center gap-2 text-slate-500 hover:text-[#0A2540] transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Mascotas
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#E0F2F1] rounded-full flex items-center justify-center">
              {getSpeciesIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0A2540]">{pet.nombre}</h1>
              <div className="flex gap-2 mt-2">
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">{speciesName}</span>
                 <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">{pet.raza?.nombre || 'Raza Desconocida'}</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500">ID de Mascota</p>
            <p className="font-mono text-slate-800 text-sm mt-1 bg-slate-50 px-3 py-1 rounded border border-slate-200">{pet.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Info size={20} className="text-[#A8DADC]" /> Detalles Físicos
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-sm text-slate-500">Edad</p>
                <p className="font-medium text-slate-800">{pet.edad} años</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Sexo</p>
                <p className="font-medium text-slate-800">{pet.sexo}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Color</p>
                <p className="font-medium text-slate-800">{pet.color}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Peso</p>
                <p className="font-medium text-slate-800">{pet.peso} kg</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <User size={20} className="text-[#A8DADC]" /> Propietario
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{pet.propietario?.username || 'Desconocido'}</p>
                <p className="text-sm text-slate-500">Asociado desde {new Date(pet.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
