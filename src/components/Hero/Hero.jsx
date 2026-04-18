import React from 'react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import './Hero.css';

const Hero = ({ 
  title = 'Bienvenido a Pet-Health',
  subtitle = 'Tu clínica veterinaria de confianza',
  description = 'Cuidamos la salud de tus mascotas con profesionalismo y dedicación',
  ctaText = 'Agendar Cita',
  secondaryCtaText = 'Conocer Servicios',
  onCtaClick,
  onSecondaryCtaClick,
  backgroundImage,
}) => {
  return (
    <section 
      className="hero"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title animate-slide-in-down">{title}</h1>
          <h2 className="hero-subtitle animate-slide-in-up">{subtitle}</h2>
          <p className="hero-description animate-fade-in">{description}</p>
          
          <div className="hero-actions">
            <Button 
              variant="primary" 
              size="lg"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onSecondaryCtaClick}
              className="hero-secondary-btn"
            >
              {secondaryCtaText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
