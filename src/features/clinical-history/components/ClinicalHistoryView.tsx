import { useState } from 'react';
import { FileText, Download, Calendar, Activity, ClipboardList, ChevronDown, ChevronUp, ShieldCheck, Stethoscope, Search } from 'lucide-react';
import logo from '../../../assets/styles/logo.png';
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
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter(c => 
    c.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(c.date).toLocaleDateString().includes(searchTerm)
  );

  const filteredVaccines = vaccines.filter(v => 
    v.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (consultationsToExport: Consultation[], vaccinesToExport: VaccinationRecord[]) => {
    const win = window.open('', '_blank');
    if (win) {
      const historyHtml = consultationsToExport.map(c => `
        <div class="report-body">
          <div class="report-section">
            <h3 class="section-header">INFORMACIÓN DE LA CONSULTA</h3>
            <div class="info-block">
              <div class="info-row">
                <span class="label">Motivo de Atención:</span>
                <span class="value">${c.reason}</span>
              </div>
              <div class="info-group">
                <span class="label">Anamnesis y Evolución:</span>
                <div class="content-text">${c.anamnesis || 'No se registran antecedentes clínicos en esta consulta.'}</div>
              </div>
            </div>
          </div>

          <div class="report-section">
            <h3 class="section-header">VALORACIÓN Y HALLAZGOS</h3>
            <div class="vitals-grid">
              <div class="vital-box"><label>Peso</label><span>${c.vitals.weight} kg</span></div>
              <div class="vital-box"><label>Temp.</label><span>${c.vitals.temperature} °C</span></div>
              <div class="vital-box"><label>F. Card.</label><span>${c.vitals.heartRate} bpm</span></div>
              <div class="vital-box"><label>F. Resp.</label><span>${c.vitals.respiratoryRate} rpm</span></div>
            </div>
            <div class="info-group mt-4">
              <span class="label">Examen Físico:</span>
              <div class="content-text">${c.physicalExam || 'Hallazgos dentro de los parámetros fisiológicos normales.'}</div>
            </div>
          </div>

          <div class="report-section clinical-box-blue">
            <h3 class="section-header color-blue">DIAGNÓSTICO MÉDICO</h3>
            <div class="content-text bold">${c.diagnosis}</div>
          </div>

          <div class="report-section clinical-box-green">
            <h3 class="section-header color-green">PLAN DE TRATAMIENTO</h3>
            <div class="content-text">${c.treatment}</div>
          </div>

          <div class="report-footer">
            <div class="signature-column">
              <div class="line"></div>
              <p class="main">Dr. ${c.vetName || 'Especialista'}</p>
              <p class="sub">Médico Veterinario</p>
              <p class="sub text-xs">Reg. Prof. PH-${c.id.toString().slice(-4).toUpperCase()}</p>
            </div>
            <div class="meta-column">
              <p><strong>Fecha de Atención:</strong> ${new Date(c.date).toLocaleDateString()}</p>
              <p><strong>Ubicación:</strong> Bogotá D.C., Colombia</p>
            </div>
          </div>
        </div>
      `).join('');

      win.document.write(`
        <html>
          <head>
            <title>Historia Clínica - ${pet.name}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Inter', sans-serif; color: #1e293b; background: white; padding: 1.5cm 2cm; line-height: 1.6; font-size: 10px; }

              /* Header Letterhead */
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 35px; }
              .logo img { height: 55px; width: auto; object-fit: contain; }
              .clinic-brand { text-align: right; }
              .clinic-brand h1 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
              .clinic-brand p { font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

              /* Pet Dashboard */
              .pet-data { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; background: #f8fafc; padding: 18px; border-radius: 6px; margin-bottom: 35px; border: 1px solid #f1f5f9; }
              .data-item label { display: block; font-size: 7px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 3px; }
              .data-item span { font-size: 11px; font-weight: 600; color: #0f172a; }

              /* Report Sections */
              .report-section { margin-bottom: 30px; }
              .section-header { font-size: 10px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; letter-spacing: 0.5px; }
              .color-blue { color: #2563eb; border-color: #bfdbfe; }
              .color-green { color: #166534; border-color: #bbf7d0; }

              .info-row { display: flex; gap: 8px; margin-bottom: 10px; }
              .info-group { margin-top: 12px; }
              .label { font-size: 9px; font-weight: 700; color: #64748b; }
              .value { font-size: 11px; color: #0f172a; }
              .content-text { font-size: 11px; color: #334155; white-space: pre-wrap; overflow-wrap: break-word; text-align: justify; margin-top: 4px; line-height: 1.6; }
              .bold { font-weight: 700; font-size: 12px; color: #0f172a; }

              /* Vitals Dashboard */
              .vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
              .vital-box { border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; text-align: center; background: white; }
              .vital-box label { display: block; font-size: 7px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
              .vital-box span { font-size: 11px; font-weight: 700; color: #0f172a; }

              /* Colored Highlight Boxes */
              .clinical-box-blue { background: #f0f7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
              .clinical-box-green { background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; }

              /* Footer Signature */
              .report-footer { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
              .signature-column { text-align: left; }
              .signature-column .line { width: 220px; border-bottom: 1.5px solid #0f172a; margin-bottom: 8px; }
              .signature-column .main { font-size: 11px; font-weight: 700; }
              .signature-column .sub { font-size: 9px; color: #64748b; }
              .meta-column { text-align: right; font-size: 9px; color: #94a3b8; }
              .text-xs { font-size: 7px; }

              .mt-4 { margin-top: 15px; }

              @media print { 
                @page { margin: 0; }
                body { padding: 2cm; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">
                <img src="${logo}" alt="Logo" />
              </div>
              <div class="clinic-brand">
                <h1>PETHEALTH CLINIC</h1>
                <p>Medicina Veterinaria Especializada</p>
                <p style="font-size: 7px; margin-top: 2px; text-transform: none; letter-spacing: 0;">Bogotá D.C. • Tel: (+57) 300 000 0000</p>
              </div>
            </div>

            <div class="pet-data">
              <div class="data-item"><label>Paciente</label><span>${pet.name}</span></div>
              <div class="data-item"><label>Especie</label><span>${pet.species}</span></div>
              <div class="data-item"><label>Raza</label><span>${pet.breed}</span></div>
              <div class="data-item"><label>Sexo</label><span>${pet.sex}</span></div>
            </div>

            ${historyHtml}

            <div style="position: absolute; bottom: 1cm; left: 0; right: 0; text-align: center; font-size: 7px; color: #cbd5e1; text-transform: uppercase;">
              Documento Oficial de Historia Clínica &copy; PetHealth System
            </div>
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => {
        win.print();
      }, 500);
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
              onClick={onNewConsultation}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/40"
            >
              <Activity size={18} />
              Nueva Consulta
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200">
        <div className="flex gap-4">
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
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar en historial..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-xs font-bold transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {activeTab === 'consultations' ? (
        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
          {filteredHistory.length > 0 ? (
            filteredHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((consultation) => (
              <div key={consultation.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute -left-[29px] top-4 z-20">
                  <div className="w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-sm"></div>
                </div>
                
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

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex-1 md:flex-none">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diagnóstico</p>
                        <p className="text-sm font-bold text-blue-600 truncate max-w-[150px]">{consultation.diagnosis}</p>
                      </div>
                      <div className="flex-1 md:flex-none hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tratamiento</p>
                        <p className="text-sm font-bold text-emerald-600 truncate max-w-[150px]">{consultation.treatment}</p>
                      </div>
                      <button className="p-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                        {expandedId === consultation.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                      </button>
                    </div>
                  </div>

                  {expandedId === consultation.id && (
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2 mb-6 text-slate-400">
                        <ClipboardList size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Detalle de la Atención</h4>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Clinical Section: Left Side */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-blue-600">
                              <ClipboardList size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Anamnesis y Evolución</h4>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Motivo Principal</p>
                                <p className="text-sm font-black text-[#0A2540] break-words">{consultation.reason}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Historia Clínica / Evolución</p>
                                <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                                  {consultation.anamnesis || 'No se registraron detalles de anamnesis.'}
                                </p>
                              </div>
                              <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Diagnóstico Definitivo</p>
                                <p className="text-sm font-black text-[#0A2540] break-words whitespace-pre-wrap">
                                  {consultation.diagnosis}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-slate-500">
                              <Activity size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Examen Físico</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
                              {consultation.physicalExam || 'No se registraron hallazgos en el examen físico.'}
                            </p>
                          </div>
                        </div>

                        {/* Plan & Vitals: Right Side */}
                        <div className="lg:col-span-5 space-y-6">
                          <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-emerald-700">
                              <ShieldCheck size={20} />
                              <h4 className="text-sm font-black uppercase tracking-widest">Plan de Tratamiento</h4>
                            </div>
                            <div className="bg-white/50 p-4 rounded-xl border border-emerald-200/50">
                              <p className="text-sm text-emerald-900 font-bold leading-relaxed break-words whitespace-pre-wrap">
                                {consultation.treatment}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                              <Stethoscope size={18} />
                              <h4 className="text-xs font-black uppercase tracking-widest">Constantes Vitales</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Peso</span>
                                <span className="text-sm font-black text-[#0A2540]">{consultation.vitals.weight} kg</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Temperatura</span>
                                <span className="text-sm font-black text-[#0A2540]">{consultation.vitals.temperature} °C</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Frec. Cardíaca</span>
                                <span className="text-sm font-black text-[#0A2540]">{consultation.vitals.heartRate} bpm</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Frec. Resp.</span>
                                <span className="text-sm font-black text-[#0A2540]">{consultation.vitals.respiratoryRate} rpm</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => generatePDF([consultation], [])}
                          className="flex items-center gap-2 px-6 py-3 bg-[#0A2540] text-white hover:bg-blue-900 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                          <Download size={18} />
                          Exportar consulta como PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <ClipboardList size={48} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-400">No se encontraron registros</h3>
              <p className="text-slate-400 text-sm mt-1">Intente con otros términos de búsqueda.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVaccines.length > 0 ? (
            filteredVaccines.map(vaccine => (
              <div key={vaccine.id} className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
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
              <h3 className="text-lg font-bold text-slate-400">No se encontraron vacunas</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
