import React from 'react';
import Card from '../Card/Card';
import './ServiceGrid.css';

const ServiceGrid = ({ services = [] }) => {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="service-grid-section">
      <div className="container">
        <div className="section-header">
          <h2>Nuestros Servicios</h2>
          <p>Ofrecemos una amplia gama de servicios veterinarios de calidad</p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="service-card"
              padding="lg"
              hover
            >
              {service.icon && (
                <div className="service-icon">
                  {service.icon}
                </div>
              )}
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              {service.price && (
                <p className="service-price">{service.price}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
