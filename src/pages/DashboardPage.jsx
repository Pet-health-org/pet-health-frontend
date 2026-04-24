import React, { useState } from 'react';
import Layout from '../layouts/Layout/Layout';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import './DashboardPage.css';

const DashboardPage = ({ logoSrc }) => {
  const [navbarLinks] = useState([
    { href: '#dashboard', label: 'Dashboard', active: true },
    { href: '#appointments', label: 'Mis Citas' },
    { href: '#pets', label: 'Mis Mascotas' },
    { href: '#perfil', label: 'Mi Perfil' },
  ]);

  const [user] = useState({
    name: 'Juan Pérez',
    email: 'juan@correo.com',
  });

  const appointments = [
    {
      id: 1,
      petName: 'Max',
      service: 'Consulta General',
      date: '2024-04-25',
      time: '14:30',
      status: 'Próximo',
    },
    {
      id: 2,
      petName: 'Luna',
      service: 'Vacunación',
      date: '2024-05-02',
      time: '10:00',
      status: 'Programado',
    },
  ];

  const pets = [
    {
      id: 1,
      name: 'Max',
      type: 'Perro',
      breed: 'Golden Retriever',
      age: 3,
      weight: '32 kg',
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Gato',
      breed: 'Siamés',
      age: 2,
      weight: '4 kg',
    },
  ];

  return (
    <Layout 
      logoSrc={logoSrc}
      navbarLinks={navbarLinks}
      isAuthenticated={true}
      userName={user.name}
    >
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p>Bienvenido, {user.name}</p>
          </div>

          <div className="dashboard-grid">
            {/* Resumen */}
            <section className="dashboard-section dashboard-summary">
              <div className="summary-cards">
                <Card className="summary-card" padding="md">
                  <div className="summary-icon">🐾</div>
                  <h3>Mis Mascotas</h3>
                  <p className="summary-number">{pets.length}</p>
                </Card>

                <Card className="summary-card" padding="md">
                  <div className="summary-icon">📅</div>
                  <h3>Citas Próximas</h3>
                  <p className="summary-number">{appointments.length}</p>
                </Card>

                <Card className="summary-card" padding="md">
                  <div className="summary-icon">📊</div>
                  <h3>Checkups</h3>
                  <p className="summary-number">5</p>
                </Card>

                <Card className="summary-card" padding="md">
                  <div className="summary-icon">💬</div>
                  <h3>Mensajes</h3>
                  <p className="summary-number">2</p>
                </Card>
              </div>
            </section>

            {/* Próximas Citas */}
            <section className="dashboard-section">
              <div className="section-title-bar">
                <h2>Próximas Citas</h2>
                <Button variant="primary" size="sm">+ Nueva Cita</Button>
              </div>

              <Card className="appointments-card" padding="lg">
                {appointments.length > 0 ? (
                  <div className="appointments-list">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="appointment-item">
                        <div className="appointment-info">
                          <h4>{apt.petName}</h4>
                          <p>{apt.service}</p>
                          <span className="appointment-date">
                            📅 {apt.date} a las {apt.time}
                          </span>
                        </div>
                        <div className="appointment-status">
                          <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No tienes citas programadas</p>
                )}
              </Card>
            </section>

            {/* Mis Mascotas */}
            <section className="dashboard-section">
              <div className="section-title-bar">
                <h2>Mis Mascotas</h2>
                <Button variant="primary" size="sm">+ Agregar Mascota</Button>
              </div>

              <div className="pets-grid">
                {pets.map((pet) => (
                  <Card key={pet.id} className="pet-card" padding="lg" hover>
                    <div className="pet-emoji">
                      {pet.type === 'Perro' ? '🐶' : '🐱'}
                    </div>
                    <h4>{pet.name}</h4>
                    <div className="pet-details">
                      <p><strong>Raza:</strong> {pet.breed}</p>
                      <p><strong>Edad:</strong> {pet.age} años</p>
                      <p><strong>Peso:</strong> {pet.weight}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      fullWidth
                    >
                      Ver Perfil
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Acciones Rápidas */}
            <section className="dashboard-section quick-actions">
              <h2>Acciones Rápidas</h2>
              <div className="actions-grid">
                <Button variant="secondary" size="md" fullWidth>
                  📞 Contactar Clínica
                </Button>
                <Button variant="secondary" size="md" fullWidth>
                  📋 Historial Médico
                </Button>
                <Button variant="secondary" size="md" fullWidth>
                  💳 Mi Facturación
                </Button>
                <Button variant="secondary" size="md" fullWidth>
                  ⚙️ Configuración
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
