import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Save,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  getNotificaciones,
  reenviarNotificacion,
} from "../../../services/notificacion.service";
import { useNotify } from "../../../context/NotificationContext";

interface NotificationLog {
  id: string;
  recipient: string;
  recipientEmail: string;
  type: string;
  status: string;
  date: string;
  message: string;
  errorMsg?: string;
}

const TEMPLATE_STORAGE_KEY = "pethealth_notification_template";

const normalizeStatus = (status: string) => {
  const value = status?.toLowerCase();
  if (value === "enviado" || value === "enviada") return "Enviado";
  if (value === "fallido" || value === "fallida") return "Fallido";
  if (value === "pendiente") return "Pendiente";
  if (value === "leída" || value === "leida") return "Leída";
  return status || "Pendiente";
};

const mapNotification = (item: any): NotificationLog => ({
  id: item.id || item._id || Math.random().toString(),
  recipient:
    item.usuario?.nombreCompleto ||
    item.usuario?.username ||
    item.destinatario ||
    item.usuarioId ||
    item.recipient ||
    "Usuario",
  recipientEmail: item.emailDestino || item.usuario?.email || "",
  type: item.tipoPlantilla || item.tipo || item.type || "Notificación",
  status: normalizeStatus(
    item.estado || item.status || (item.leida ? "Leída" : "Pendiente"),
  ),
  date:
    item.fechaEnvio ||
    item.fechaCreacion ||
    item.fecha ||
    item.createdAt ||
    item.date ||
    new Date().toISOString(),
  message: item.mensaje || item.message || "Sin mensaje registrado",
  errorMsg: item.errorMsg,
});

export function NotificationsPage() {
  const { notify } = useNotify();
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [template, setTemplate] = useState(() => {
    const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      type: "recordatorio_cita",
      subject: "Recordatorio: Próxima cita de [Nombre Mascota]",
      body: "Hola [Nombre Dueño],\n\nTe recordamos que [Nombre Mascota] tiene una cita programada para el día [Fecha Cita] a las [Hora Cita].\n\nPor favor, contáctanos si necesitas reprogramar.\n\nSaludos,\nEl equipo de PetHealth",
    };
  });

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getNotificaciones({
        limit: 50,
        estado: statusFilter || undefined,
        tipo: typeFilter || undefined,
      });
      const raw = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setLogs(raw.map(mapNotification));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      notify("error", "Error", "No se pudieron cargar las notificaciones.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [statusFilter, typeFilter]);

  const filteredLogs = logs.filter((log) => {
    const search = searchTerm.toLowerCase();
    return (
      log.recipient.toLowerCase().includes(search) ||
      log.recipientEmail.toLowerCase().includes(search) ||
      log.type.toLowerCase().includes(search) ||
      log.message.toLowerCase().includes(search)
    );
  });

  const handleResend = async (log: NotificationLog) => {
    setResendingId(log.id);
    try {
      const response = await reenviarNotificacion(log.id);
      const updated = mapNotification(response.data);
      setLogs((prev) =>
        prev.map((item) => (item.id === log.id ? updated : item)),
      );
      notify(
        "success",
        "Notificación reenviada",
        "El correo fue procesado nuevamente.",
      );
    } catch (error: any) {
      notify(
        "error",
        "No se pudo reenviar",
        error.response?.data?.message ||
          "Solo se pueden reenviar notificaciones fallidas.",
      );
    } finally {
      setResendingId(null);
    }
  };

  const handleSaveTemplate = () => {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(template));
    notify(
      "success",
      "Plantilla guardada",
      "La configuración de la plantilla fue guardada localmente.",
    );
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">
            Centro de Notificaciones
          </h1>
          <p className="text-slate-500">
            Gestión de alertas, recordatorios y comunicaciones.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Settings size={18} />
            Configurar Plantillas
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            <h3 className="font-bold text-[#0A2540]">Historial Reciente</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por destinatario, correo, tipo o mensaje..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#A8DADC] bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#A8DADC]"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="enviado">Enviado</option>
              <option value="fallido">Fallido</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[#A8DADC]"
            >
              <option value="">Todos los tipos</option>
              <option value="recordatorio_cita">Recordatorio de cita</option>
              <option value="alerta_vacuna">Alerta de vacuna</option>
              <option value="stock_bajo">Stock bajo</option>
              <option value="confirmacion_cita">Confirmación de cita</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Destinatario</th>
                <th className="p-4 font-semibold">Tipo</th>
                <th className="p-4 font-semibold">Mensaje</th>
                <th className="p-4 font-semibold">Fecha y Hora</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    Cargando notificaciones...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-400">
                    No hay notificaciones con estos filtros.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const canResend = log.status === "Fallido";
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-slate-400" />
                          {log.recipient}
                        </div>
                        {log.recipientEmail && (
                          <p className="text-[11px] text-slate-400 mt-1">
                            {log.recipientEmail}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-600">{log.type}</td>
                      <td
                        className="p-4 text-sm text-slate-600 max-w-xs truncate"
                        title={log.message}
                      >
                        {log.message}
                      </td>
                      <td className="p-4 text-sm text-slate-500">
                        {new Date(log.date).toLocaleString("es-ES")}
                      </td>
                      <td className="p-4">
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold ${log.status === "Enviado" || log.status === "Leída" ? "text-green-600" : log.status === "Fallido" ? "text-red-600" : "text-amber-600"}`}
                        >
                          {log.status === "Enviado" ||
                          log.status === "Leída" ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {log.status}
                        </div>
                        {log.errorMsg && (
                          <p
                            className="text-[10px] text-red-500 mt-1 max-w-[180px] truncate"
                            title={log.errorMsg}
                          >
                            {log.errorMsg}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleResend(log)}
                          disabled={!canResend || resendingId === log.id}
                          className="text-xs font-bold text-[#0A2540] hover:underline disabled:text-slate-300 disabled:no-underline disabled:cursor-not-allowed"
                          title={
                            canResend
                              ? "Reenviar notificación fallida"
                              : "Solo se pueden reenviar notificaciones fallidas"
                          }
                        >
                          {resendingId === log.id
                            ? "Reenviando..."
                            : "Reenviar"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <Settings className="text-[#0A2540]" size={24} />
                <h2 className="text-xl font-bold text-[#0A2540]">
                  Configurar Plantillas
                </h2>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Tipo de Notificación
                  </label>
                  <select
                    value={template.type}
                    onChange={(e) =>
                      setTemplate({ ...template, type: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  >
                    <option value="recordatorio_cita">
                      Recordatorio de Cita
                    </option>
                    <option value="alerta_vacuna">Aviso de Vacunación</option>
                    <option value="stock_bajo">
                      Alerta de Inventario Bajo
                    </option>
                    <option value="confirmacion_cita">
                      Confirmación de Cita
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Asunto del Correo / Mensaje
                  </label>
                  <input
                    type="text"
                    value={template.subject}
                    onChange={(e) =>
                      setTemplate({ ...template, subject: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Contenido de la Plantilla
                  </label>
                  <textarea
                    rows={6}
                    value={template.body}
                    onChange={(e) =>
                      setTemplate({ ...template, body: e.target.value })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A2540] font-mono text-sm"
                  />
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex flex-col gap-1">
                    <span className="font-semibold">
                      Variables dinámicas disponibles:
                    </span>
                    <span>
                      [Nombre Dueño], [Nombre Mascota], [Fecha Cita], [Hora
                      Cita], [Nombre Vacuna], [Nombre Producto]
                    </span>
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
                onClick={handleSaveTemplate}
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
