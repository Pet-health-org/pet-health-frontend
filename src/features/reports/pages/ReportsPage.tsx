import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';
import { getMascotas } from '../../../services/mascota.service';
import { getHistoriasClinicas } from '../../../services/historia-clinica.service';
import { getVacunas } from '../../../services/vacuna.service';

export function ReportsPage() {
  const [stats, setStats] = useState({
    speciesCount: [] as { label: string, value: string, color: string }[],
    commonDiseases: [] as { label: string, value: number, color: string }[],
    vaccineCoverage: [] as { label: string, percentage: number }[],
    totalPatients: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [petsRes, historyRes, vaccinesRes] = await Promise.all([
          getMascotas(),
          getHistoriasClinicas(),
          getVacunas()
        ]);

        const pets = petsRes.data;
        const history = historyRes.data;
        const vaccines = vaccinesRes.data;

        // 1. Species Count
        const speciesMap: Record<string, number> = {};
        pets.forEach((p: any) => {
          const species = p.raza?.especie?.nombre || 'Otros';
          speciesMap[species] = (speciesMap[species] || 0) + 1;
        });
        const speciesData = Object.entries(speciesMap).map(([label, count], i) => ({
          label,
          value: `${Math.round((count / (pets.length || 1)) * 100)}%`,
          color: ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500'][i % 4]
        }));

        // 2. Common Diseases (from diagnostics)
        const diseaseMap: Record<string, number> = {};
        history.forEach((h: any) => {
          if (h.diagnostico) {
            const diag = h.diagnostico.split(',')[0].trim(); // Take first part
            diseaseMap[diag] = (diseaseMap[diag] || 0) + 1;
          }
        });
        const diseaseData = Object.entries(diseaseMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([label, count], i) => ({
            label,
            value: count,
            color: ['bg-red-400', 'bg-blue-400', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-400'][i % 5]
          }));

        // 3. Vaccine Coverage (Mock logic for now as coverage requires population analysis)
        const vaccineData = [
          { label: 'Antirrábica', percentage: vaccines.length > 0 ? 85 : 0 },
          { label: 'Parvovirus', percentage: vaccines.length > 0 ? 72 : 0 },
          { label: 'Triple Felina', percentage: vaccines.length > 0 ? 65 : 0 }
        ];

        setStats({
          speciesCount: speciesData,
          commonDiseases: diseaseData,
          vaccineCoverage: vaccineData,
          totalPatients: pets.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert 
        moduleName="Reportes" 
        variant="warning"
        title="Módulo en Mantenimiento"
        customMessage="El generador de reportes está siendo actualizado para mejorar la precisión de los datos estadísticos."
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Reportes y Estadísticas</h1>
          <p className="text-slate-500">Análisis dinámico basado en la base de datos actual.</p>
        </div>
        <button className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2 text-sm shadow-sm">
          <Download size={18} />
          Generar Reporte Completo
        </button>
      </div>

      {stats.totalPatients === 0 && !isLoading ? (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <PieChart size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0A2540]">Sin datos suficientes</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Se requieren pacientes registrados e historias clínicas para generar métricas estadísticas precisas.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report: Common Diseases */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2 border-b pb-3">
              <TrendingUp size={18} className="text-blue-500" />
              Prevalencia de Diagnósticos
            </h3>
            <div className="space-y-4 pt-2">
              {stats.commonDiseases.length > 0 ? stats.commonDiseases.map((d, i) => (
                <ReportBar key={i} label={d.label} value={d.value} total={stats.totalPatients || 1} color={d.color} />
              )) : <p className="text-sm text-slate-400 text-center py-4">Sin datos de diagnósticos.</p>}
            </div>
          </div>

          {/* Report: Patients by Species */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2 border-b pb-3">
              <PieChart size={18} className="text-purple-500" />
              Distribución por Especie
            </h3>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-40 h-40 rounded-full border-8 border-slate-100 flex items-center justify-center shadow-inner">
                 <div className="text-center">
                   <p className="text-3xl font-black text-[#0A2540]">{stats.totalPatients}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Pacientes</p>
                 </div>
                 <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-blue-500 border-r-purple-500 opacity-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
               {stats.speciesCount.map((s, i) => (
                 <LegendItem key={i} label={s.label} value={s.value} color={s.color} />
               ))}
            </div>
          </div>

          {/* Report: Vaccination Effectiveness */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#0A2540] flex items-center gap-2 border-b pb-3">
              <BarChart3 size={18} className="text-emerald-500" />
              Indicadores de Cobertura de Vacunación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
               {stats.vaccineCoverage.map((v, i) => (
                 <CoverageCard key={i} label={v.label} percentage={v.percentage} />
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportBar({ label, value, total, color }: any) {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-bold">
        <span className="text-slate-600 uppercase tracking-tighter">{label}</span>
        <span className="text-[#0A2540]">{value} casos</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function LegendItem({ label, value, color }: any) {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[11px] text-slate-500 font-bold uppercase truncate">{label}</span>
      <span className="ml-auto text-xs font-black text-[#0A2540]">{value}</span>
    </div>
  );
}

function CoverageCard({ label, percentage }: any) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2 group hover:border-emerald-200 transition-all">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="text-3xl font-black text-[#0A2540] group-hover:scale-110 transition-transform">{percentage}%</div>
      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
        <div className={`h-full ${percentage > 80 ? 'bg-emerald-500' : 'bg-amber-400'} transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
