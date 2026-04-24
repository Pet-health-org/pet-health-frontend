import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';

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
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            {/* Replace with actual logo image later, using icon for fallback visually */}
            <Activity size={64} className="text-[#0A2540]" />
          </div>
          <h1 className="text-5xl font-extrabold text-[#0A2540] tracking-tight">PetHealth</h1>
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
  const navigate = useNavigate();
  const [role, setRole] = useState<'Administrador'|'Veterinario'|'Recepcionista'>('Administrador');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    login({ id: '1', name: 'Usuario Demo', role });
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0A2540]">Bienvenido de nuevo</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                defaultValue="demo@pethealth.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rol (Simulación)</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all"
              >
                <option value="Administrador">Administrador</option>
                <option value="Veterinario">Veterinario</option>
                <option value="Recepcionista">Recepcionista</option>
              </select>
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 mt-4 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors"
            >
              Entrar al sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0A2540]">Crear Cuenta</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Registro simulado'); onClose(); }}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#A8DADC] focus:border-[#0A2540] outline-none transition-all" required />
            </div>
            
            <button type="submit" className="w-full py-3 mt-4 bg-[#0A2540] text-white rounded-lg font-medium hover:bg-[#113255] transition-colors">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
