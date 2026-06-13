import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoadingScreen } from './components/LoadingScreen';

import { Home } from './pages/Home';

// Lazy loaded modules
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const OwnersPage = lazy(() => import('./features/owners/pages/OwnersPage').then(m => ({ default: m.OwnersPage })));
const OwnerProfilePage = lazy(() => import('./features/owners/pages/OwnerProfilePage').then(m => ({ default: m.OwnerProfilePage })));
const StaffPage = lazy(() => import('./features/owners/pages/StaffPage').then(m => ({ default: m.StaffPage })));
const IntegrantesPage = lazy(() => import('./features/integrantes/pages/IntegrantesPage').then(m => ({ default: m.IntegrantesPage })));
const PetsPage = lazy(() => import('./features/pets/pages/PetsPage').then(m => ({ default: m.PetsPage })));
const PetProfilePage = lazy(() => import('./features/pets/pages/PetProfilePage').then(m => ({ default: m.PetProfilePage })));
const AppointmentsPage = lazy(() => import('./features/appointments/pages/AppointmentsPage').then(m => ({ default: m.AppointmentsPage })));
const ClinicalHistoryPage = lazy(() => import('./features/clinical-history/pages/ClinicalHistoryPage').then(m => ({ default: m.ClinicalHistoryPage })));
const VaccinationPage = lazy(() => import('./features/vaccinations/pages/VaccinationPage').then(m => ({ default: m.VaccinationPage })));
const InventoryPage = lazy(() => import('./features/inventory/pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const NotificationsPage = lazy(() => import('./features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ReportsPage = lazy(() => import('./features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
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
                    <Route path="/integrantes" element={<IntegrantesPage />} />
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
