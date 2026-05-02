import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { OwnersPage } from './features/owners/pages/OwnersPage';
import { StaffPage } from './features/owners/pages/StaffPage';
import { PetsPage } from './features/pets/pages/PetsPage';
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
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Feature routes */}
              <Route path="/owners" element={<OwnersPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/pets" element={<PetsPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/clinical-history" element={<ClinicalHistoryPage />} />
              <Route path="/vaccinations" element={<VaccinationPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
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
