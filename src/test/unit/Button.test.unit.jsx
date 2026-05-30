import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@/components/Button/Button';

describe('Button Component', () => {
  it('debe renderizar correctamente con su children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('debe aplicar las clases de variante y tamaño por defecto', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('btn-md');
  });

  it('debe aplicar la clase de ancho completo si fullWidth es true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');
    expect(button).toHaveClass('btn-full-width');
  });

  it('debe estar deshabilitado cuando disabled es true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-disabled');
  });

  it('debe ejecutar la función onClick cuando es clickeado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByText('Clickable');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no debe ejecutar onClick si está deshabilitado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled Click</Button>);
    
    const button = screen.getByText('Disabled Click');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});
