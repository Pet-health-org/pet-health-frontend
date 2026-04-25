import { BarChart3, PieChart, TrendingUp, Download, Calendar } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert moduleName="Reportes y Estadísticas" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Reportes y Estadísticas</h1>
          <p className="text-slate-500">Análisis mensual de atención y salud poblacional.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none">
            <option>Abril 2024</option>
            <option>Marzo 2024</option>
            <option>Febrero 2024</option>
          </select>
          <button className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2 text-sm shadow-sm">
            <Download size={18} />
            Exportar Todos (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report: Common Diseases (HU-22) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              Enfermedades Comunes (Top 5)
            </h3>
            <Download size={16} className="text-slate-300 cursor-pointer hover:text-slate-600" />
          </div>
          <div className="space-y-3">
            <ReportBar label="Parvovirosis" value={25} total={100} color="bg-red-400" />
            <ReportBar label="Dermatitis" value={18} total={100} color="bg-blue-400" />
            <ReportBar label="Gastroenteritis" value={15} total={100} color="bg-amber-400" />
            <ReportBar label="Otitis" value={12} total={100} color="bg-emerald-400" />
            <ReportBar label="Conjuntivitis" value={8} total={100} color="bg-purple-400" />
          </div>
        </div>

        {/* Report: Patients by Species (HU-23) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2">
              <PieChart size={18} className="text-purple-500" />
              Pacientes por Especie
            </h3>
            <Download size={16} className="text-slate-300 cursor-pointer hover:text-slate-600" />
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40 rounded-full border-8 border-slate-100 flex items-center justify-center">
               <div className="text-center">
                 <p className="text-2xl font-bold text-[#0A2540]">142</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Total</p>
               </div>
               {/* Decorative segments simulation */}
               <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-blue-500 border-r-purple-500 rotate-45"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <LegendItem label="Perros" value="65%" color="bg-blue-500" />
             <LegendItem label="Gatos" value="25%" color="bg-purple-500" />
             <LegendItem label="Aves" value="7%" color="bg-amber-500" />
             <LegendItem label="Otros" value="3%" color="bg-slate-400" />
          </div>
        </div>

        {/* Report: Vaccination Effectiveness (HU-24) */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-500" />
              Efectividad de Vacunación (Cobertura)
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">Ver detalles</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
             <CoverageCard label="Antirrábica" percentage={92} />
             <CoverageCard label="Parvovirus" percentage={85} />
             <CoverageCard label="Triple Felina" percentage={78} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportBar({ label, value, total, color }: any) {
  const percentage = (value / total) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function LegendItem({ label, value, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`}></div>
      <span className="text-xs text-slate-600 font-medium">{label}:</span>
      <span className="text-xs font-bold text-[#0A2540]">{value}</span>
    </div>
  );
}

function CoverageCard({ label, percentage }: any) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{label}</p>
      <div className="text-3xl font-extrabold text-[#0A2540]">{percentage}%</div>
      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
        <div className={`h-full ${percentage > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
