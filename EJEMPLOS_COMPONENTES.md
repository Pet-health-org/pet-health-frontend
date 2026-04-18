// Ejemplos de uso de componentes - Pet-Health

// ============================================
// 1. BOTONES
// ============================================

import Button from './components/Button/Button';

// Botón Primario (Verde Marino)
<Button variant="primary" size="md">
  Agendar Cita
</Button>

// Botón Secundario (Azul Marino)
<Button variant="secondary" size="lg">
  Contactar Clínica
</Button>

// Botón Outline
<Button variant="outline" size="md">
  Ver Más
</Button>

// Botón Deshabilitado
<Button variant="primary" disabled>
  Procesando...
</Button>

// Botón Full Width
<Button variant="primary" fullWidth>
  Iniciar Sesión
</Button>

// ============================================
// 2. INPUTS
// ============================================

import Input from './components/Input/Input';
import { useState } from 'react';

function FormExample() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  return (
    <>
      {/* Input básico */}
      <Input
        label="Correo Electrónico"
        type="email"
        placeholder="tu@correo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      {/* Input con icono */}
      <Input
        label="Teléfono"
        type="tel"
        placeholder="123-456-7890"
        icon="📱"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Input con error */}
      <Input
        label="Contraseña"
        type="password"
        error="La contraseña debe tener al menos 8 caracteres"
      />

      {/* Input con help text */}
      <Input
        label="Nombre de usuario"
        helpText="Solo letras, números y guiones"
      />

      {/* Input deshabilitado */}
      <Input
        label="ID de Usuario"
        value="USER-123"
        disabled
      />
    </>
  );
}

// ============================================
// 3. CARDS
// ============================================

import Card from './components/Card/Card';

// Card básica
<Card padding="md">
  <h3>Consulta Veterinaria</h3>
  <p>Revisión general de la salud de tu mascota</p>
  <p className="price">$50</p>
</Card>

// Card con hover
<Card padding="lg" hover>
  <div className="service-icon">🩺</div>
  <h3>Vacunación</h3>
  <p>Protege a tu mascota con nuestro programa de vacunas</p>
</Card>

// Card como contenedor
<Card className="profile-card">
  <div className="card-header">
    <h3>Mi Perfil</h3>
  </div>
  <div className="card-body">
    {/* Contenido */}
  </div>
  <div className="card-footer">
    <Button>Editar</Button>
  </div>
</Card>

// ============================================
// 4. HEADER Y NAVBAR
// ============================================

import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';

function AppHeader() {
  const handleLogout = () => {
    console.log('Logout');
  };

  const navLinks = [
    { href: '#home', label: 'Inicio', active: true },
    { href: '#servicios', label: 'Servicios' },
    { href: '#about', label: 'Acerca de' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <>
      <Header
        logoSrc="/logo.png"
        title="Pet-Health"
        subtitle="Clínica Veterinaria"
        onLogoClick={() => window.location.href = '/'}
      />

      <Navbar
        links={navLinks}
        isAuthenticated={true}
        userName="Juan Pérez"
        onLogout={handleLogout}
      />
    </>
  );
}

// ============================================
// 5. LAYOUT
// ============================================

import Layout from './components/Layout/Layout';

function PageWithLayout() {
  const navLinks = [
    { href: '#home', label: 'Inicio', active: true },
    { href: '#servicios', label: 'Servicios' },
  ];

  return (
    <Layout
      logoSrc="/logo.png"
      navbarLinks={navLinks}
      isAuthenticated={true}
      userName="Juan"
    >
      <div className="container">
        <h1>Contenido de la página</h1>
        <p>Este contenido está dentro del Layout</p>
      </div>
    </Layout>
  );
}

// ============================================
// 6. HERO SECTION
// ============================================

import Hero from './components/Hero/Hero';

function PageWithHero() {
  return (
    <Hero
      title="Bienvenido a Pet-Health"
      subtitle="Tu clínica veterinaria de confianza"
      description="Contamos con profesionales certificados para cuidar a tu mascota"
      ctaText="Agendar Cita"
      secondaryCtaText="Conocer Servicios"
      onCtaClick={() => console.log('Cita agendada')}
      onSecondaryCtaClick={() => console.log('Ver servicios')}
    />
  );
}

// ============================================
// 7. SERVICE GRID
// ============================================

import ServiceGrid from './components/ServiceGrid/ServiceGrid';

function ServicesPage() {
  const services = [
    {
      icon: '🩺',
      title: 'Consultas Veterinarias',
      description: 'Chequeos completos y diagnósticos profesionales',
      price: 'Desde $50',
    },
    {
      icon: '💉',
      title: 'Vacunación',
      description: 'Programa completo de vacunación y desparasitación',
      price: 'Desde $35',
    },
    {
      icon: '🐾',
      title: 'Cirugías',
      description: 'Procedimientos quirúrgicos con tecnología moderna',
      price: 'Consultar',
    },
    {
      icon: '✨',
      title: 'Grooming',
      description: 'Baño, corte y acondicionamiento profesional',
      price: 'Desde $45',
    },
  ];

  return <ServiceGrid services={services} />;
}

// ============================================
// 8. FORMULARIO COMPLETO
// ============================================

import { useState } from 'react';
import Input from './components/Input/Input';
import Button from './components/Button/Button';
import Card from './components/Card/Card';

function AppointmentForm() {
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'perro',
    email: '',
    phone: '',
    date: '',
    service: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular envío
    setTimeout(() => {
      console.log('Cita agendada:', formData);
      setLoading(false);
      alert('Cita agendada exitosamente');
    }, 1500);
  };

  return (
    <Card padding="lg" className="form-card">
      <h2>Agendar Cita Veterinaria</h2>
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Nombre de tu mascota"
          name="petName"
          value={formData.petName}
          onChange={handleChange}
          placeholder="Ej: Max"
          fullWidth
          required
        />

        <Input
          label="Tu correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@correo.com"
          fullWidth
          required
        />

        <Input
          label="Teléfono"
          name="phone"
          type="tel"
          icon="📱"
          value={formData.phone}
          onChange={handleChange}
          placeholder="123-456-7890"
          fullWidth
        />

        <Input
          label="Fecha de la cita"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Agendar Cita'}
        </Button>
      </form>
    </Card>
  );
}

// ============================================
// 9. GRID RESPONSIVO
// ============================================

import './styles.css';

function ResponsiveGrid() {
  return (
    <div className="container">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-lg)',
      }}>
        {[1, 2, 3, 4, 5, 6].map(item => (
          <Card key={item} padding="lg" hover>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>
              🐾
            </div>
            <h3>Servicio {item}</h3>
            <p>Descripción del servicio</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 10. COMPOSICIÓN DE PÁGINA COMPLETA
// ============================================

import React from 'react';
import Layout from './components/Layout/Layout';
import Hero from './components/Hero/Hero';
import ServiceGrid from './components/ServiceGrid/ServiceGrid';
import Card from './components/Card/Card';
import Button from './components/Button/Button';

function CompletePage() {
  const navLinks = [
    { href: '#home', label: 'Inicio', active: true },
    { href: '#servicios', label: 'Servicios' },
    { href: '#about', label: 'Acerca de' },
  ];

  const services = [
    {
      icon: '🩺',
      title: 'Consultas',
      description: 'Chequeos profesionales',
      price: 'Desde $50',
    },
    {
      icon: '💉',
      title: 'Vacunas',
      description: 'Protección completa',
      price: 'Desde $35',
    },
    {
      icon: '🐾',
      title: 'Cirugías',
      description: 'Técnicas avanzadas',
      price: 'Consultar',
    },
  ];

  return (
    <Layout
      logoSrc="/logo.png"
      navbarLinks={navLinks}
    >
      {/* Hero */}
      <Hero
        title="Bienvenido a Pet-Health"
        subtitle="Cuidamos a tu mascota"
      />

      {/* Servicios */}
      <ServiceGrid services={services} />

      {/* Sección personalizada */}
      <section style={{ padding: 'var(--space-2xl) 0', background: '#fff' }}>
        <div className="container">
          <h2>¿Por qué elegirnos?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-lg)',
          }}>
            {['Profesionales', 'Modernos', 'Cuidadosos'].map((reason, i) => (
              <Card key={i} padding="md">
                <h3>✓ {reason}</h3>
                <p>Descripción del beneficio</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-green))',
        color: '#fff',
        padding: 'var(--space-2xl) 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ color: '#fff' }}>¿Necesitas ayuda?</h2>
          <Button variant="primary">Contactar</Button>
        </div>
      </section>
    </Layout>
  );
}

export default CompletePage;
