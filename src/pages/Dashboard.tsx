import { Calendar, Syringe, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DevelopmentAlert } from '../components/DevelopmentAlert';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert moduleName="Estadísticas y Resumen" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Dashboard</h1>
          <p className="text-slate-500">Bienvenido/a, {user?.username}. Aquí está el resumen de hoy.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium">Fecha de hoy</p>
          <p className="text-[#0A2540] font-bold">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Citas del Día" 
          value="12" 
          subtitle="3 por confirmar"
          icon={<Calendar className="text-[#0A2540]" size={24} />} 
          trend="+2 que ayer"
          trendUp={true}
        />
        <SummaryCard 
          title="Vacunas Pendientes" 
          value="5" 
          subtitle="Para esta semana"
          icon={<Syringe className="text-[#A8DADC]" size={24} />} 
        />
        <SummaryCard 
          title="Stock Bajo" 
          value="8" 
          subtitle="Artículos críticos"
          icon={<AlertTriangle className="text-[#EF4444]" size={24} />} 
          alert
        />
        <SummaryCard 
          title="Ingresos del Día" 
          value="$1,240" 
          subtitle="Estimado"
          icon={<TrendingUp className="text-emerald-500" size={24} />} 
          trend="+15%"
          trendUp={true}
        />
      </div>

      {/* Additional dashboard content can go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-[#0A2540] mb-4">Próximas Citas</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4">
                  1{i}:00
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">Max (Golden Retriever)</h4>
                  <p className="text-sm text-slate-500">Propietario: Juan Pérez</p>
                </div>
                <div className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Confirmada
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-[#0A2540] mb-4">Alertas de Inventario</h2>
          <div className="space-y-4">
             {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-3 bg-red-50 text-red-800 rounded-lg border border-red-100">
                <AlertTriangle size={20} className="mr-3 text-red-500" />
                <div className="flex-1">
                  <h4 className="font-semibold">Vacuna Antirrábica</h4>
                  <p className="text-sm text-red-600/80">Quedan 2 dosis (Mínimo: 10)</p>
                </div>
                <button className="text-sm bg-white px-3 py-1 rounded shadow-sm text-red-600 hover:bg-red-50 transition-colors">
                  Reabastecer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon, trend, trendUp, alert }: any) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${alert ? 'border-red-200 shadow-red-100' : 'border-slate-200'} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${alert ? 'bg-red-50' : 'bg-slate-50'}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
