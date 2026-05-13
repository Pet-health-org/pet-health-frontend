import { Calendar, Syringe, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getCitas } from '../services/citas.service';
import { getVacunas } from '../services/vacunas.service';
import { getInventarios } from '../services/inventario.service';
import { DevelopmentAlert } from '../components/DevelopmentAlert';

export function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(0);
  const [pendingVaccines, setPendingVaccines] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const citasRes = await getCitas();
        setAppointments(citasRes.data.length);
        // Get next 3 upcoming appointments
        const sorted = [...citasRes.data].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setRecentAppointments(sorted.slice(0, 3));

        const vacunasRes = await getVacunas();
        setPendingVaccines(vacunasRes.data.length);

        const stockRes = await getInventarios();
        const low = stockRes.data.filter((item: any) => item.stock <= item.minStock);
        setLowStock(low.length);
        setLowStockItems(low.slice(0, 2));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {user?.rol.name === 'veterinario' ? (
        <DevelopmentAlert 
          moduleName="Panel de Veterinario" 
          variant="warning"
          title="Vista de Veterinario en Pruebas"
          customMessage="Bienvenido al panel médico. Actualmente estamos validando las herramientas de diagnóstico y prescripción rápida con la base de datos real."
        />
      ) : (
        <DevelopmentAlert 
          moduleName="Dashboard" 
          variant="info"
          title="Panel de Control Funcional"
          customMessage="Este panel muestra estadísticas reales extraídas directamente de la base de datos sincronizada."
        />
      )}
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
          title="Citas Totales"
          value={appointments}
          subtitle="Registradas en sistema"
          icon={<Calendar className="text-[#0A2540]" size={24} />}
        />
        <SummaryCard
          title="Vacunas Aplicadas"
          value={pendingVaccines}
          subtitle="Historial completo"
          icon={<Syringe className="text-[#A8DADC]" size={24} />}
        />
        <SummaryCard
          title="Stock Bajo"
          value={lowStock}
          subtitle="Productos en alerta"
          icon={<AlertTriangle className="text-[#E63946]" size={24} />}
          alert={lowStock > 0}
        />
      </div>

      {/* Additional dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-[#0A2540] mb-4">Próximas Citas</h2>
          <div className="space-y-4">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((cita) => (
                <div key={cita.id} className="flex items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold mr-4 text-xs">
                    {cita.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{cita.mascota?.name || 'Mascota'}</h4>
                    <p className="text-sm text-slate-500">Fecha: {new Date(cita.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    cita.status === 'Programada' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {cita.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-8">No hay citas programadas.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-[#0A2540] mb-4">Alertas de Inventario</h2>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-red-50 text-red-800 rounded-lg border border-red-100">
                  <AlertTriangle size={20} className="mr-3 text-red-500" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-red-600/80">Quedan {item.stock} {item.unit} (Mínimo: {item.minStock})</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-8">Todo el inventario está en niveles óptimos.</p>
            )}
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
