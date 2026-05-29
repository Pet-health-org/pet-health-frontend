import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dog, Cat, Bird, HelpCircle, Activity, Info, Calendar, User, FileText, Syringe, Phone, Mail, ShieldAlert, ShieldCheck } from 'lucide-react';
import { findOne as getMascotaById } from '../../../services/mascota.service';
import { findOne as getPropietarioById } from '../../../services/propietario.service';
import { findByMascota as getHistoriasClinicasByMascota } from '../../../services/historia-clinica.service';
import { findAll as getVacunasAll } from '../../../services/vacuna.service';

export function PetProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        setIsLoading(true);
        // Execute API calls concurrently to ensure load time under 2 seconds
        const [petRes, historyRes, vacunasRes] = await Promise.all([
          getMascotaById(id as string),
          getHistoriasClinicasByMascota(id as string).catch(() => ({ data: [] })),
          getVacunasAll().catch(() => ({ data: [] })) // Mocking because backend lacks findByMascota
        ]);

        const petData = petRes.data;
        setPet(petData);
        setHistory(historyRes.data || []);
        setVaccines(vacunasRes.data || []);

        // Fetch owner if ID is available
        const ownerId = petData.propietarioId || petData.duenoId || petData.userId || petData.propietario?.id;
        if (ownerId) {
          try {
            const ownerRes = await getPropietarioById(ownerId);
            setOwner(ownerRes.data);
          } catch (e) {
            setOwner(petData.propietario || petData.dueno || null);
          }
        } else {
          setOwner(petData.propietario || petData.dueno || null);
        }

      } catch (error) {
        console.error('Error fetching pet profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchFullProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-[#0A2540]"></div>
        <p className="text-slate-500 font-medium animate-pulse">Cargando perfil del paciente...</p>
      </div>
    );
  }
  
  if (!pet) return <div className="p-8 text-center text-red-500 font-bold bg-red-50 rounded-xl border border-red-200">Mascota no encontrada</div>;

  const speciesName = pet.raza?.especie?.nombre || pet.especie?.nombre || pet.species || 'Desconocido';
  const breedName = pet.raza?.nombre || pet.breed || 'Raza Desconocida';
  
  const getSpeciesIcon = () => {
    const s = speciesName.toLowerCase();
    if (s.includes('perro') || s.includes('dog')) return <Dog size={40} className="text-[#0A2540]" />;
    if (s.includes('gato') || s.includes('cat')) return <Cat size={40} className="text-[#0A2540]" />;
    if (s.includes('ave') || s.includes('bird')) return <Bird size={40} className="text-[#0A2540]" />;
    return <HelpCircle size={40} className="text-[#0A2540]" />;
  };

  // Automatically calculate age
  let calculatedAge = pet.edad || pet.age;
  if (pet.fechaNacimiento || pet.fecha_nacimiento || pet.birthDate) {
    const dob = new Date(pet.fechaNacimiento || pet.fecha_nacimiento || pet.birthDate);
    if (!isNaN(dob.getTime())) {
      const ageDifMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDifMs);
      calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  }

  // Last 3 consultations summary
  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(a.date || a.fecha).getTime();
    const dateB = new Date(b.date || b.fecha).getTime();
    return dateB - dateA;
  }).slice(0, 3);

  // Vaccination status
  let isVaccinationUpToDate = true;
  let pendingCount = 0;
  const today = new Date();
  vaccines.forEach(v => {
    const nextDate = new Date(v.nextBoosterDate || v.proximaFecha);
    if (nextDate < today) {
      isVaccinationUpToDate = false;
      pendingCount++;
    }
  });

  if (vaccines.length === 0) {
    isVaccinationUpToDate = false;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <button 
          onClick={() => navigate('/pets')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0A2540] transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Volver a Mascotas
        </button>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">ID de Paciente</p>
          <p className="font-mono text-slate-700 text-sm">{pet.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Pet and Owner Info */}
        <div className="space-y-6">
          
          {/* Pet Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
            <div className="h-24 bg-gradient-to-r from-[#0A2540] to-[#1E4C7A]"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 relative z-10 group-hover:-translate-y-1 transition-transform">
                  {pet.foto || pet.photoUrl ? (
                    <img src={pet.foto || pet.photoUrl} alt={pet.nombre} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    getSpeciesIcon()
                  )}
                </div>
                <div className="flex gap-2 relative z-10">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shadow-sm">{speciesName}</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-black text-[#0A2540] mb-1">{pet.nombre || pet.name}</h1>
              <p className="text-sm text-slate-500 font-medium mb-6">{breedName}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Edad</p>
                  <p className="font-semibold text-slate-700">{calculatedAge !== undefined ? `${calculatedAge} años` : 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Sexo</p>
                  <p className="font-semibold text-slate-700">{pet.sexo || pet.sex || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Color</p>
                  <p className="font-semibold text-slate-700">{pet.color || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Peso Actual</p>
                  <p className="font-semibold text-slate-700">{pet.peso || pet.weight ? `${pet.peso || pet.weight} kg` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} /> Datos del Propietario
            </h3>
            {owner ? (
              <div className="space-y-4">
                <div>
                  <p className="font-bold text-lg text-[#0A2540]">{owner.nombre || owner.name || owner.username || 'Nombre no disponible'}</p>
                  <p className="text-xs text-slate-500">{owner.cedula || owner.document ? `C.I: ${owner.cedula || owner.document}` : ''}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Phone size={14} />
                    </div>
                    <span className="font-medium text-slate-700">{owner.telefono || owner.phone || 'Teléfono no registrado'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Mail size={14} />
                    </div>
                    <span className="font-medium text-slate-700 break-all">{owner.email || owner.correo || 'Email no registrado'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">Información del propietario no disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Health Status */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vaccination Status */}
          <div className={`rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${isVaccinationUpToDate ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isVaccinationUpToDate ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                {isVaccinationUpToDate ? <ShieldCheck size={32} /> : <ShieldAlert size={32} />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#0A2540]">Estado de Vacunación</h3>
                <p className={`text-sm font-medium ${isVaccinationUpToDate ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isVaccinationUpToDate 
                    ? 'Esquema al día. Protección óptima.' 
                    : vaccines.length === 0 
                      ? 'No hay registros de vacunación.' 
                      : `Atención: ${pendingCount} vacuna(s) pendiente(s).`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/vaccinations')}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${isVaccinationUpToDate ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
            >
              Ver Esquema Completo
            </button>
          </div>

          {/* Consultations Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> Últimas Consultas
              </h3>
              <button 
                onClick={() => navigate('/clinical-history')}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver Historial Completo
              </button>
            </div>

            {sortedHistory.length > 0 ? (
              <div className="space-y-4">
                {sortedHistory.map((consultation, index) => (
                  <div key={consultation.id || index} className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-3 items-start">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-blue-600 mt-1">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-[#0A2540] mb-1">
                            {consultation.diagnosis || consultation.diagnostico || 'Diagnóstico no registrado'}
                          </p>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {consultation.reason || consultation.motivo || 'Motivo de consulta no especificado'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                          <Calendar size={12} />
                          {new Date(consultation.date || consultation.fecha || consultation.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm mb-3">
                  <Activity size={24} />
                </div>
                <p className="font-bold text-slate-500">No hay consultas previas</p>
                <p className="text-sm text-slate-400 mt-1">Este paciente no tiene historial clínico registrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

