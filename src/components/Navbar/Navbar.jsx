import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ links = [], onLogout, isAuthenticated = false, userName = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <button
            className={`navbar-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="navbar-links">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`navbar-link ${link.active ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="navbar-actions">
              {isAuthenticated ? (
                <div className="navbar-user">
                  <span className="navbar-username">{userName}</span>
                  <button
                    className="navbar-logout"
                    onClick={onLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="navbar-login">Iniciar sesión</a>
                  <a href="/register" className="navbar-register">Registrarse</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
