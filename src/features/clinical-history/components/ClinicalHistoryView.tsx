import { useState } from 'react';
import { FileText, Download, Calendar, Activity, ClipboardList, ChevronDown, ChevronUp, ShieldCheck, User, Stethoscope } from 'lucide-react';
import { Consultation } from '../types';
import { Pet } from '../../pets/types';
import { VaccinationRecord } from '../../vaccinations/types';

interface ClinicalHistoryViewProps {
  pet: Pet;
  history: Consultation[];
  vaccines: VaccinationRecord[];
  onNewConsultation: () => void;
}

export function ClinicalHistoryView({ pet, history, vaccines, onNewConsultation }: ClinicalHistoryViewProps) {
  const [activeTab, setActiveTab] = useState<'consultations' | 'vaccines'>('consultations');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExportPDF = () => {
    // Simulation of PDF export
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head><title>Historia Clínica - ${pet.name}</title></head>
          <body style="font-family: sans-serif; padding: 40px;">
            <h1>Historia Clínica: ${pet.name}</h1>
            <p>Especie: ${pet.species} | Raza: ${pet.breed}</p>
            <hr/>
            <h2>Consultas</h2>
            ${history.map(c => `
              <div style="margin-bottom: 20px;">
                <strong>Fecha: ${c.date}</strong><br/>
                Diagnóstico: ${c.diagnosis}<br/>
                Tratamiento: ${c.treatment}
              </div>
            `).join('')}
          </body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Info Card */}
      <div className="bg-[#0A2540] text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <FileText size={40} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black tracking-tight">{pet.name}</h2>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[10px] font-bold uppercase tracking-widest">Paciente Activo</span>
              </div>
              <p className="text-blue-100/70 font-medium mt-1">{pet.breed} • {pet.sex} • {pet.weight}kg • ID: {pet.id}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExportPDF}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Download size={18} />
              Exportar PDF
            </button>
            <button 
              onClick={onNewConsultation}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/40"
            >
              <Activity size={18} />
              Nueva Consulta
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('consultations')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'consultations' ? 'text-[#0A2540]' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Línea de Tiempo (Consultas)
          {activeTab === 'consultations' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A2540] rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('vaccines')}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === 'vaccines' ? 'text-[#0A2540]' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Historial de Vacunas
          {activeTab === 'vaccines' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A2540] rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'consultations' ? (
        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
          {history.length > 0 ? (
            history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((consultation) => (
              <div key={consultation.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[29px] top-4 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-sm z-10"></div>
                
                <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${expandedId === consultation.id ? 'shadow-xl ring-1 ring-blue-500/20' : 'hover:shadow-md shadow-sm'}`}>
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group" onClick={() => toggleExpand(consultation.id)}>
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl text-[#0A2540] group-hover:bg-blue-50 transition-colors">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0A2540]">
                          {new Date(consultation.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Stethoscope size={12} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">Dr. {consultation.vetName || 'Asignado'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="flex-1 md:flex-none">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnóstico</p>
                        <p className="text-sm font-bold text-blue-600 truncate max-w-[200px]">{consultation.diagnosis}</p>
                      </div>
                      <button className="p-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {expandedId === consultation.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </button>
                    </div>
                  </div>

                  {expandedId === consultation.id && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/30 animate-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Motivo y Evolución</h4>
                            <p className="text-sm font-semibold text-[#0A2540]">{consultation.reason}</p>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{consultation.anamnesis}</p>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Examen Físico</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{consultation.physicalExam}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <h4 className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ShieldCheck size={14} /> Plan de Tratamiento
                            </h4>
                            <p className="text-sm text-emerald-900 font-medium leading-relaxed">{consultation.treatment}</p>
                          </div>
                          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Constantes Vitales</h4>
                            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Peso:</span>
                                <span className="text-[#0A2540]">{consultation.vitals.weight}kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Temp:</span>
                                <span className="text-[#0A2540]">{consultation.vitals.temperature}°C</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">FC:</span>
                                <span className="text-[#0A2540]">{consultation.vitals.heartRate}bpm</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">FR:</span>
                                <span className="text-[#0A2540]">{consultation.vitals.respiratoryRate}rpm</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <ClipboardList size={48} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400">No hay registros clínicos</h3>
              <p className="text-slate-400 text-sm mt-1">El historial cronológico aparecerá aquí una vez registre la primera consulta.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaccines.length > 0 ? (
            vaccines.map(vaccine => (
              <div key={vaccine.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-black text-[#0A2540]">{vaccine.vaccineName}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">Aplicada: {vaccine.applicationDate}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold">Lote: {vaccine.lotNumber}</span>
                    <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-lg font-bold">Dosis: {vaccine.dose}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <ShieldCheck size={48} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400">No hay vacunas registradas</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
