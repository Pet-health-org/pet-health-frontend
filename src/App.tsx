import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { OwnersPage } from './features/owners/pages/OwnersPage';
import { OwnerProfilePage } from './features/owners/pages/OwnerProfilePage';
import { StaffPage } from './features/owners/pages/StaffPage';
import { PetsPage } from './features/pets/pages/PetsPage';
import { PetProfilePage } from './features/pets/pages/PetProfilePage';
import { AppointmentsPage } from './features/appointments/pages/AppointmentsPage';
import { ClinicalHistoryPage } from './features/clinical-history/pages/ClinicalHistoryPage';
import { VaccinationPage } from './features/vaccinations/pages/VaccinationPage';
import { InventoryPage } from './features/inventory/pages/InventoryPage';
import { NotificationsPage } from './features/notifications/pages/NotificationsPage';
import { ReportsPage } from './features/reports/pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Rutas compartidas por todos */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              
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
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
