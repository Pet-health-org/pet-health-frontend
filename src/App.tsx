import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { OwnersPage } from './features/owners/pages/OwnersPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Owners Feature routes */}
              <Route path="/owners" element={<OwnersPage />} />
              
              {/* Placeholders for other routes */}
              <Route path="/pets" element={<div className="p-8">Módulo de Mascotas (En desarrollo)</div>} />
              <Route path="/appointments" element={<div className="p-8">Módulo de Citas (En desarrollo)</div>} />
              <Route path="/clinical-history" element={<div className="p-8">Historial Clínico (En desarrollo)</div>} />
              <Route path="/vaccinations" element={<div className="p-8">Vacunación (En desarrollo)</div>} />
              <Route path="/inventory" element={<div className="p-8">Inventario (En desarrollo)</div>} />
              <Route path="/notifications" element={<div className="p-8">Notificaciones (En desarrollo)</div>} />
              <Route path="/reports" element={<div className="p-8">Reportes (En desarrollo)</div>} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
