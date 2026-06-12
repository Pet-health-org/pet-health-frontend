import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

type MenuItem = {
  path: string;
  label: string;
  icon: any;
  badge?: number;
};
import { useAuth } from '../context/AuthContext';
import { useNotify } from '../context/NotificationContext';
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
  LogOut,
} from 'lucide-react';
import { GlobalSearch } from '../components/GlobalSearch';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { notify } = useNotify();
  const location = useLocation();

  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchLowStock = async () => {
      // Solo admins y recepcionistas ven inventario en su menú
      if (user?.rol?.name === 'admin' || user?.rol?.name === 'recepcionista') {
        try {
          // Import dynamic to avoid top-level cyclic issues if any, or just direct import
          const { findBajoStock } = await import('../services/inventario.service');
          const res = await findBajoStock();
          setLowStockCount(res.data.length);
        } catch (e) {
          console.error('Error fetching low stock for badge:', e);
        }
      }
    };
    fetchLowStock();
  }, [user]);

  // Listener para errores de Acceso Denegado (403)
  useEffect(() => {
    const handleForbidden = (e: Event) => {
      const customEvent = e as CustomEvent;
      notify('error', 'Acceso Denegado', customEvent.detail);
    };
    window.addEventListener('forbidden-access', handleForbidden);
    return () => window.removeEventListener('forbidden-access', handleForbidden);
  }, [notify]);

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/appointments', label: 'Citas', icon: Calendar },
    ];

    const role = user?.rol?.name;

    if (role === 'admin') {
      return [
        ...baseItems,
        { path: '/staff', label: 'Personal', icon: Users },
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/clinical-history', label: 'Historial Clínico', icon: FileText },
        { path: '/vaccinations', label: 'Vacunas', icon: Syringe },
        { path: '/inventory', label: 'Inventario', icon: Package, badge: lowStockCount },
        { path: '/notifications', label: 'Notificaciones', icon: Bell },
        { path: '/reports', label: 'Reportes', icon: BarChart3 },
      ];
    }

    if (role === 'veterinario') {
      return [
        ...baseItems,
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/clinical-history', label: 'Historial Clínico', icon: FileText },
        { path: '/vaccinations', label: 'Vacunas', icon: Syringe },
      ];
    }

    if (role === 'recepcionista') {
      return [
        ...baseItems,
        { path: '/owners', label: 'Propietarios', icon: Users },
        { path: '/pets', label: 'Mascotas', icon: Dog },
        { path: '/inventory', label: 'Inventario', icon: Package, badge: lowStockCount },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col border-r border-slate-100 shadow-sm hidden md:flex">

        {/* Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <img
            src="/src/assets/styles/logo2.png"
            alt="PetHealth Logo"
            className="h-16 w-auto object-contain drop-shadow-sm"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              console.warn('Logo no encontrado');
            }}
          />
          <h1 className="text-2xl font-bold text-[#0A2540] tracking-tight">PetHealth</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                  ? 'bg-[#E0F2F1] text-[#0A2540] font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-[#0A2540]'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={isActive ? 'text-[#0A2540]' : 'text-slate-400 group-hover:text-slate-500'}
                  />
                  <span>{item.label}</span>
                </div>
                {/* Badge Render */}
                {item.badge ? (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer opcional */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <div className="text-xs text-slate-400 px-4">
            {new Date().getFullYear()} © PetHealth
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white h-20 flex items-center justify-between px-6 md:px-8 border-b border-slate-100 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-semibold text-slate-700 hidden md:block whitespace-nowrap mr-4">
              Panel de Control
            </h2>

            {(user?.rol?.name === 'admin' || user?.rol?.name === 'recepcionista') && (
              <div className="flex-1 max-w-lg hidden sm:block">
                <GlobalSearch />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 ml-4">
            {/* Usuario */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-[#0A2540]">{user?.username}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {user?.rol?.description}
                </p>
              </div>

              <div className="w-9 h-9 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A] rounded-full flex items-center justify-center text-white font-medium shadow">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 hover:text-red-600"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}