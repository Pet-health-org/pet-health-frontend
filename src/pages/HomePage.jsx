import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero/Hero';
import ServiceGrid from '../components/ServiceGrid/ServiceGrid';
import './HomePage.css';

const HomePage = ({ logoSrc }) => {
  const [navbarLinks] = useState([
    { href: '#home', label: 'Inicio', active: true },
    { href: '#servicios', label: 'Servicios' },
    { href: '#about', label: 'Acerca de' },
    { href: '#contacto', label: 'Contacto' },
  ]);

  const services = [
    {
      icon: '🩺',
      title: 'Consultas Veterinarias',
      description: 'Chequeos de salud completos y diagnósticos profesionales para tus mascotas.',
      price: 'Desde $50',
    },
    {
      icon: '💉',
      title: 'Vacunación',
      description: 'Programa completo de vacunación y desparasitación para proteger a tu mascota.',
      price: 'Desde $35',
    },
    {
      icon: '🐾',
      title: 'Cirugías',
      description: 'Procedimientos quirúrgicos con tecnología moderna y anestesia segura.',
      price: 'Consultar',
    },
    {
      icon: '✨',
      title: 'Grooming y Aseo',
      description: 'Baño, corte y acondicionamiento profesional para la higiene de tu mascota.',
      price: 'Desde $45',
    },
    {
      icon: '🦷',
      title: 'Limpieza Dental',
      description: 'Limpieza y cuidado bucodental avanzado para la salud oral de tu mascota.',
      price: 'Desde $80',
    },
    {
      icon: '🏥',
      title: 'Internamiento',
      description: 'Cuidados intensivos y monitoreo 24/7 en caso de emergencias veterinarias.',
      price: 'Consultar',
    },
  ];

  const handleAgendarCita = () => {
    console.log('Agendar cita');
    // Redirigir a página de citas o abrir modal
  };

  const handleConocerServicios = () => {
    console.log('Conocer servicios');
    // Scroll a sección de servicios
  };

  return (
    <Layout 
      logoSrc={logoSrc}
      navbarLinks={navbarLinks}
    >
      <Hero 
        title="Bienvenido a Pet-Health"
        subtitle="La clínica veterinaria que cuida a tu mascota"
        description="Contamos con profesionales certificados y equipamiento de última tecnología para asegurar la salud y bienestar de tu mascota."
        ctaText="Agendar Cita"
        secondaryCtaText="Conocer Servicios"
        onCtaClick={handleAgendarCita}
        onSecondaryCtaClick={handleConocerServicios}
      />

      <ServiceGrid services={services} />

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>¿Por qué elegir Pet-Health?</h2>
              <ul className="about-features">
                <li>✓ Equipo de veterinarios especializados</li>
                <li>✓ Atención personalizada para cada mascota</li>
                <li>✓ Tecnología veterinaria de punta</li>
                <li>✓ Horarios flexibles y citas express</li>
                <li>✓ Precios competitivos y transparentes</li>
                <li>✓ Seguimiento post-atención garantizado</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="about-placeholder">
                🐶
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Necesitas atención veterinaria?</h2>
            <p>Agenda tu cita hoy y garantiza la salud de tu mascota</p>
            <button className="cta-button">Agendar Cita Ahora</button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
