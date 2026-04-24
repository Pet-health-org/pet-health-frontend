import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Dog, 
  Calendar, 
  FileText, 
  Syringe, 
  Package, 
  Bell, 
  BarChart3,
  LogOut
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/appointments', label: 'Citas', icon: Calendar },
      { path: '/notifications', label: 'Notificaciones', icon: Bell },
    ];

    if (user?.role === 'Administrador') {
      return [
        ...baseItems,
        { path: '/owners', label: 'Propietarios', icon: Users },
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/clinical-history', label: 'Historial Clínico', icon: FileText },
        { path: '/vaccinations', label: 'Vacunas', icon: Syringe },
        { path: '/inventory', label: 'Inventario', icon: Package },
        { path: '/reports', label: 'Reportes', icon: BarChart3 },
      ];
    }

    if (user?.role === 'Veterinario') {
      return [
        ...baseItems,
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/clinical-history', label: 'Historial Clínico', icon: FileText },
        { path: '/vaccinations', label: 'Vacunas', icon: Syringe },
      ];
    }

    if (user?.role === 'Recepcionista') {
      return [
        ...baseItems,
        { path: '/owners', label: 'Propietarios', icon: Users },
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/inventory', label: 'Inventario', icon: Package },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0A2540] text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          {/* We assume logo.png exists in src/assets/styles/logo.png as requested */}
          <img src="/src/assets/styles/logo.png" alt="PetHealth Logo" className="h-8 w-auto object-contain bg-white rounded-md p-1" onError={(e) => e.currentTarget.style.display = 'none'} />
          <h1 className="text-xl font-bold tracking-wide">PetHealth</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-right hidden sm:block">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-slate-300 text-xs">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} className="text-[#A8DADC]" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden md:block flex-shrink-0">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[#E0F2F1] text-[#0A2540] font-medium shadow-sm border border-[#A8DADC]' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#0A2540]' : 'text-slate-400'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
