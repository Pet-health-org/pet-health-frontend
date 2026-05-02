import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotificationContext';
import api from '../services/api';
import logo from '../assets/styles/logo.png';

type ModalType = 'login' | 'register' | null;

export function Home() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A8DADC] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#0A2540] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="z-10 text-center space-y-8 p-6 max-w-2xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center items-center mb-2">
            <img src={logo} alt="PetHealth Logo" className="h-64 w-64 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
          </div>
          <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
            Gestión veterinaria moderna y eficiente. Cuidamos de los que más quieres con la mejor tecnología.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={() => setActiveModal('login')}
            className="px-8 py-3 bg-[#0A2540] text-white rounded-lg font-medium shadow-lg shadow-[#0A2540]/20 hover:bg-[#113255] hover:-translate-y-0.5 transition-all duration-200"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setActiveModal('register')}
            className="px-8 py-3 bg-white text-[#0A2540] rounded-lg font-medium shadow-sm border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200"
          >
            Crear Cuenta
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'register' && <RegisterModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAuth();
  const { notify } = useNotify();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (failedAttempts >= 3) {
      notify('error', 'Acceso Bloqueado', 'Has superado el número de intentos permitidos. Por seguridad, el acceso ha sido bloqueado temporalmente.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const { access_token } = response.data;
      
      // The login function now handles profile fetching
      await login(access_token);
      
      notify('success', 'Bienvenido', 'Has iniciado sesión correctamente.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        notify('error', 'Acceso Bloqueado', 'Has fallado 3 intentos. Acceso bloqueado.');
      } else {
        const message = error.response?.data?.message || 'Credenciales incorrectas.';
        notify('error', 'Error de acceso', `${message} Intento ${newAttempts}/3`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLocked = failedAttempts >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0A2540]">Bienvenido de nuevo</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>
          
          {isLocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <p>Acceso bloqueado por seguridad tras 3 intentos fallidos.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked}
                className={`w-full px-4 py-2 border ${isLocked ? 'bg-slate-50 border-slate-200' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all`}
                placeholder="Ej: admin"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
                className={`w-full px-4 py-2 border ${isLocked ? 'bg-slate-50 border-slate-200' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all`}
                placeholder="••••••••"
                required 
              />
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting || isLocked}
              className={`w-full py-3 mt-4 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors flex items-center justify-center ${isSubmitting || isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : isLocked ? 'Cuenta Bloqueada' : 'Entrar al sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  const { notify } = useNotify();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mapping name to username for the backend
      const username = name.toLowerCase().replace(/\s+/g, '_');
      
      await api.post('/users', {
        username,
        email,
        password,
        rolId: 'propietario', // Default role for public registration
        nombreCompleto: name
      });

      notify('success', 'Registro Exitoso', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
      onClose();
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Error al crear la cuenta. Es posible que el registro público esté restringido.';
      notify('error', 'Error de registro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0A2540]">Crear Cuenta</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>
          
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">🚧</span>
            <div>
              <p className="font-bold mb-1">Registro Público en Desarrollo</p>
              <p className="text-xs text-amber-700">
                El sistema de registro público actualmente <strong>no está en funcionamiento</strong>. 
                Debido a configuraciones de seguridad en el servidor, solo el Administrador puede crear cuentas nuevas desde su panel interno.
              </p>
            </div>
          </div>
          
          <form className="space-y-4 opacity-50 pointer-events-none" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 outline-none" 
                placeholder="Ej: Juan Pérez"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 outline-none" 
                placeholder="juan@correo.com"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 outline-none" 
                placeholder="••••••••"
                disabled
              />
            </div>
            
            <button 
              type="button" 
              disabled
              className="w-full py-3 mt-4 bg-slate-300 text-slate-500 rounded-lg font-medium flex items-center justify-center cursor-not-allowed"
            >
              Funcionalidad Deshabilitada
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
