import { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Clock, Settings, Save } from 'lucide-react';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';
import { getNotificaciones } from '../../../services/notificaciones.service';

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
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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
      <DevelopmentAlert 
        moduleName="Notificaciones" 
        variant="warning"
        title="Módulo en Mantenimiento"
        customMessage="El centro de notificaciones está siendo optimizado para mejorar la entrega de recordatorios vía email."
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Centro de Notificaciones</h1>
          <p className="text-slate-500">Gestión de alertas, recordatorios y comunicaciones.</p>
        </div>
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
        >
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

      {/* Editor de Plantillas Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <Settings className="text-[#0A2540]" size={24} />
                <h2 className="text-xl font-bold text-[#0A2540]">Configurar Plantillas</h2>
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Tipo de Notificación</label>
                  <select className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540]">
                    <option>Recordatorio de Cita</option>
                    <option>Aviso de Vacunación</option>
                    <option>Alerta de Inventario Bajo</option>
                    <option>Bienvenida de Paciente</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Asunto del Correo / Mensaje</label>
                  <input type="text" defaultValue="Recordatorio: Próxima cita de [Nombre Mascota]" className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540]" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Contenido de la Plantilla</label>
                  <textarea 
                    rows={6}
                    defaultValue={"Hola [Nombre Dueño],\n\nTe recordamos que [Nombre Mascota] tiene una cita programada para el día [Fecha Cita] a las [Hora Cita].\n\nPor favor, contáctanos si necesitas reprogramar.\n\nSaludos,\nEl equipo de PetHealth"}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540] font-mono text-sm"
                  />
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex flex-col gap-1">
                    <span className="font-semibold">Variables dinámicas disponibles:</span>
                    <span>[Nombre Dueño], [Nombre Mascota], [Fecha Cita], [Hora Cita], [Nombre Vacuna], [Nombre Producto]</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2"
              >
                <Save size={18} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
