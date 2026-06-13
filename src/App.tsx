import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { GlobalLoader } from './components/GlobalLoader';

// Lazy loading de páginas para mostrar el GlobalLoader
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const OwnersPage = React.lazy(() => import('./features/owners/pages/OwnersPage').then(m => ({ default: m.OwnersPage })));
const OwnerProfilePage = React.lazy(() => import('./features/owners/pages/OwnerProfilePage').then(m => ({ default: m.OwnerProfilePage })));
const StaffPage = React.lazy(() => import('./features/owners/pages/StaffPage').then(m => ({ default: m.StaffPage })));
const PetsPage = React.lazy(() => import('./features/pets/pages/PetsPage').then(m => ({ default: m.PetsPage })));
const PetProfilePage = React.lazy(() => import('./features/pets/pages/PetProfilePage').then(m => ({ default: m.PetProfilePage })));
const AppointmentsPage = React.lazy(() => import('./features/appointments/pages/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const ClinicalHistoryPage = React.lazy(() => import('./features/clinical-history/pages/ClinicalHistoryPage').then(m => ({ default: m.ClinicalHistoryPage })));
const VaccinationPage = React.lazy(() => import('./features/vaccinations/pages/VaccinationPage').then(m => ({ default: m.VaccinationPage })));
const InventoryPage = React.lazy(() => import('./features/inventory/pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const NotificationsPage = React.lazy(() => import('./features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ReportsPage = React.lazy(() => import('./features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Suspense fallback={<GlobalLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  {/* Rutas compartidas por todos */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  
                  {/* Rutas Recepcionista y Admin */}
                  <Route element={<ProtectedRoute allowedRoles={['recepcionista', 'admin']} />}>
                    <Route path="/owners" element={<OwnersPage />} />
                    <Route path="/owners/:id" element={<OwnerProfilePage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                  </Route>

                  {/* Rutas Veterinario y Admin */}
                  <Route element={<ProtectedRoute allowedRoles={['veterinario', 'admin']} />}>
                    <Route path="/clinical-history" element={<ClinicalHistoryPage />} />
                    <Route path="/vaccinations" element={<VaccinationPage />} />
                  </Route>

                  {/* Rutas Mascotas (Compartida por todos) */}
                  <Route path="/pets" element={<PetsPage />} />
                  <Route path="/pets/:id" element={<PetProfilePage />} />

                  {/* Rutas Solo Admin */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/staff" element={<StaffPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                  </Route>
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
