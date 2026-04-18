import React from 'react';
import './Header.css';

const Header = ({ 
  logoSrc, 
  title = 'Pet-Health',
  subtitle = 'Clínica Veterinaria',
  onLogoClick,
  children,
  className = '',
}) => {
  return (
    <header className={`header ${className}`}>
      <div className="container">
        <div className="header-content">
          <div className="header-brand" onClick={onLogoClick} role="button" tabIndex={0}>
            {logoSrc && (
              <img src={logoSrc} alt={title} className="header-logo" />
            )}
            <div className="header-text">
              <h1 className="header-title">{title}</h1>
              <p className="header-subtitle">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;
