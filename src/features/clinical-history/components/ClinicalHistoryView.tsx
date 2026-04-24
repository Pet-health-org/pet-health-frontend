import { FileText, Download, Calendar, Activity, ClipboardList } from 'lucide-react';
import { Consultation } from '../types';
import { Pet } from '../../pets/types';

interface ClinicalHistoryViewProps {
  pet: Pet;
  history: Consultation[];
  onNewConsultation: () => void;
}

export function ClinicalHistoryView({ pet, history, onNewConsultation }: ClinicalHistoryViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0A2540]">Historia Clínica: {pet.name}</h2>
            <p className="text-sm text-slate-500">{pet.breed} • {pet.sex} • {pet.color}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
            onClick={() => alert('Exportando a PDF...')}
          >
            <Download size={18} />
            Exportar PDF
          </button>
          <button 
            className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2"
            onClick={onNewConsultation}
          >
            <Activity size={18} />
            Nueva Consulta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {history.length > 0 ? (
          history.map((consultation, index) => (
            <div key={consultation.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[#0A2540]">
                    <Calendar size={18} />
                  </div>
                  <span className="font-bold text-[#0A2540]">
                    {new Date(consultation.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Consulta #{history.length - index}</span>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ClipboardList size={14} /> Motivo y Anamnesis
                    </h4>
                    <p className="text-sm font-semibold text-[#0A2540]">{consultation.reason}</p>
                    <p className="text-sm text-slate-600 mt-1">{consultation.anamnesis}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Constantes Vitales</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-500">Peso:</span> <span className="font-bold">{consultation.vitals.weight}kg</span></div>
                      <div><span className="text-slate-500">Temp:</span> <span className="font-bold">{consultation.vitals.temperature}°C</span></div>
                      <div><span className="text-slate-500">FC:</span> <span className="font-bold">{consultation.vitals.heartRate}bpm</span></div>
                      <div><span className="text-slate-500">FR:</span> <span className="font-bold">{consultation.vitals.respiratoryRate}rpm</span></div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Examen Físico</h4>
                    <p className="text-sm text-slate-600">{consultation.physicalExam}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <h4 className="text-xs font-bold text-blue-800 mb-1">Diagnóstico</h4>
                      <p className="text-sm text-blue-900">{consultation.diagnosis}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <h4 className="text-xs font-bold text-emerald-800 mb-1">Tratamiento</h4>
                      <p className="text-sm text-emerald-900">{consultation.treatment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 text-center border border-dashed border-slate-300 rounded-xl">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-400">No hay consultas registradas</h3>
            <p className="text-slate-400 text-sm mt-1">Haga clic en "Nueva Consulta" para comenzar el registro clínico.</p>
          </div>
        )}
      </div>
    </div>
  );
}
