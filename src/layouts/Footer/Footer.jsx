import React from 'react';
import './Footer.css';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Pet-Health</h4>
            <p>Cuidamos la salud de tus mascotas con profesionalismo y amor.</p>
          </div>
          
          <div className="footer-section">
            <h4>Servicios</h4>
            <ul>
              <li><a href="#consultas">Consultas</a></li>
              <li><a href="#cirugias">Cirugías</a></li>
              <li><a href="#vacunas">Vacunas</a></li>
              <li><a href="#grooming">Grooming</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <ul>
              <li><a href="tel:+1234567890">+1 (234) 567-8900</a></li>
              <li><a href="mailto:info@pethealth.com">info@pethealth.com</a></li>
              <li>Avenida Principal, 123</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="footer-socials">
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#twitter" aria-label="Twitter">𝕏</a>
              <a href="#instagram" aria-label="Instagram">📷</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Pet-Health. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
