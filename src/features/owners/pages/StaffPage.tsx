import React, { useState } from 'react';
import { Users, UserPlus, Shield, X } from 'lucide-react';
import { useNotify } from '../../../context/NotificationContext';
import api from '../../../services/api';
import { DevelopmentAlert } from '../../../components/DevelopmentAlert';

export function StaffPage() {
  const { notify } = useNotify();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rolId: 'veterinario' // default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      // Usamos el endpoint general y filtramos en el frontend, 
      // o usamos los específicos si existen. Vamos a usar el general
      const res = await api.get('/users');
      const filtered = res.data.filter((u: any) => 
        u.rol.name === 'veterinario' || u.rol.name === 'recepcionista'
      );
      setStaff(filtered);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/users', formData);
      notify('success', 'Personal Creado', 'La cuenta ha sido creada exitosamente.');
      setIsFormOpen(false);
      setFormData({ username: '', email: '', password: '', rolId: 'veterinario' });
      fetchStaff(); // Refresh list after creation
    } catch (error: any) {
      console.error('Error creating staff:', error);
      notify('error', 'Error', error.response?.data?.message || 'No se pudo crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <DevelopmentAlert 
        moduleName="Personal Médico y Administrativo" 
        title="Módulo Funcional con Ajustes Pendientes"
        customMessage="Este módulo ya se comunica con la base de datos para guardar y listar el personal. Sin embargo, está pendiente una actualización en el backend (separación de tablas) para registrar detalles adicionales como especialidad y número de licencia."
        variant="info"
      />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Gestión de Personal</h1>
          <p className="text-slate-500">Creación de cuentas para Veterinarios y Recepcionistas.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-all flex items-center gap-2"
        >
          <UserPlus size={18} />
          Nuevo Personal
        </button>
      </div>
      
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A2540]"></div>
        </div>
      ) : staff.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 font-semibold">Usuario</th>
                  <th className="p-4 font-semibold">Correo</th>
                  <th className="p-4 font-semibold">Rol</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {staff.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0A2540] font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        user.rol.name === 'veterinario' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.rol.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'activo' ? 'bg-green-100 text-green-700' : 
                        user.status === 'inactivo' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          <Shield size={48} className="mx-auto mb-4 text-[#A8DADC]" />
          <h3 className="text-lg font-bold text-[#0A2540] mb-2">Sin personal registrado</h3>
          <p className="max-w-md mx-auto text-sm">
            Aún no hay veterinarios ni recepcionistas en el sistema. 
            Usa el botón superior para agregar nuevos miembros al equipo.
          </p>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0A2540]">Registrar Personal</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña temporal</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol a asignar</label>
                <select
                  value={formData.rolId}
                  onChange={e => setFormData({...formData, rolId: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] outline-none bg-white"
                >
                  <option value="veterinario">Veterinario (Atención Médica)</option>
                  <option value="recepcionista">Recepcionista (Gestión de Citas)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  * Limitado a roles operativos. No es posible asignar roles de Administrador o Propietario.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0A2540] text-white rounded-lg hover:bg-[#113255] disabled:opacity-70 flex items-center gap-2"
                >
                  {isSubmitting ? 'Guardando...' : 'Crear Cuenta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
