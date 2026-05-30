import React, { useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificationProvider, useNotify } from '@/context/NotificationContext';

// Un componente de prueba que usa el hook useNotify
const TestComponent = () => {
  const notify = useNotify();

  return (
    <div>
      <button 
        onClick={() => notify.notify('success', 'Test Title', 'Test Message')}
        data-testid="trigger-btn"
      >
        Trigger Notification
      </button>
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('debe renderizar un toast con el título y mensaje cuando se llama a notify', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Inicialmente no debe haber notificaciones
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();

    // Disparar la notificación
    act(() => {
      screen.getByTestId('trigger-btn').click();
    });

    // Verificar que aparece
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('el toast debe desaparecer automáticamente después de 5 segundos', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Disparar la notificación
    act(() => {
      screen.getByTestId('trigger-btn').click();
    });

    expect(screen.getByText('Test Title')).toBeInTheDocument();

    // Avanzar el tiempo 5 segundos
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Ya no debe estar en el DOM
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });
});
