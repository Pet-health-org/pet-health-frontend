import { Mail, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

interface NotificationLog {
  id: string;
  recipient: string;
  type: 'Confirmación Cita' | 'Recordatorio Cita' | 'Alerta Vacunación';
  status: 'Enviado' | 'Fallido';
  date: string;
}

const mockLogs: NotificationLog[] = [
  { id: '1', recipient: 'juan.perez@example.com', type: 'Confirmación Cita', status: 'Enviado', date: '2024-04-24T10:00:00Z' },
  { id: '2', recipient: 'maria.gomez@example.com', type: 'Alerta Vacunación', status: 'Fallido', date: '2024-04-24T09:15:00Z' },
  { id: '3', recipient: 'carlos.r@example.com', type: 'Recordatorio Cita', status: 'Enviado', date: '2024-04-23T16:45:00Z' },
];

export function NotificationsPage() {
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
              {mockLogs.map(log => (
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
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${log.status === 'Enviado' ? 'text-green-600' : 'text-red-600'}`}>
                      {log.status === 'Enviado' ? <CheckCircle size={14} /> : <XCircle size={14} />}
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
