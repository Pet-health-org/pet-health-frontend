import React from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ 
  children, 
  logoSrc,
  navbarLinks = [],
  isAuthenticated = false,
  userName = '',
  onLogout,
}) => {
  return (
    <div className="layout">
      <Header 
        logoSrc={logoSrc} 
        title="Pet-Health" 
        subtitle="Clínica Veterinaria"
      />
      
      <Navbar 
        links={navbarLinks}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={onLogout}
      />
      
      <main className="layout-main">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
