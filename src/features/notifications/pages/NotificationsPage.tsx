import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';
import { getNotificaciones } from '../../../services/api';

interface NotificationLog {
  id: string;
  recipient: string;
  type: string;
  status: string;
  date: string;
}

export function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotificaciones();
        const mappedLogs = response.data.map((item: any) => ({
          id: item.id || item._id || Math.random().toString(),
          recipient: item.destinatario || item.usuarioId || item.recipient || 'Usuario',
          type: item.tipo || item.type || 'Notificación',
          status: item.estado || item.status || (item.leida ? 'Leída' : 'No Leída'),
          date: item.fecha || item.createdAt || item.date || new Date().toISOString()
        }));
        setLogs(mappedLogs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert moduleName="Notificaciones" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Centro de Notificaciones</h1>
          <p className="text-slate-500">Gestión de alertas, recordatorios y comunicaciones.</p>
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2">
          <Settings size={18} />
          Configurar Plantillas
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2">
          <Clock size={18} className="text-slate-400" />
          <h3 className="font-bold text-[#0A2540]">Historial Reciente (HU-20)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Destinatario</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center p-4">Cargando notificaciones...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4">No hay notificaciones</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {log.recipient}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{log.type}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(log.date).toLocaleString('es-ES')}
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${log.status === 'Enviado' || log.status === 'Leída' ? 'text-green-600' : 'text-amber-600'}`}>
                      {log.status === 'Enviado' || log.status === 'Leída' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {log.status}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-[#0A2540] hover:underline">Reenviar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
