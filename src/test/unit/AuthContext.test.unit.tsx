import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import api from '@/services/api';

// Mock del API
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Componente de prueba para consumir el hook
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-name">{user.username}</div>}
      <button onClick={() => login('fake-token')} data-testid="login-btn">Login</button>
      <button onClick={() => logout()} data-testid="logout-btn">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada prueba
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe iniciar como no autenticado si no hay token en localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });

  it('debe autenticar al usuario exitosamente al llamar a login', async () => {
    // Preparar el mock de la respuesta del perfil
    const mockUser = {
      id: '1',
      username: 'testadmin',
      email: 'admin@test.com',
      rol: { name: 'admin', description: 'Administrador' }
    };
    
    // Configurar la promesa resuelta para api.get
    vi.mocked(api.get).mockResolvedValue({ data: mockUser });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Ejecutar login
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });

    // Verificar que se llamó al API
    expect(api.get).toHaveBeenCalledWith('/users/profile', expect.any(Object));
    
    // Verificar que el estado cambió a autenticado usando waitFor
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-name')).toHaveTextContent('testadmin');
    });
    
    // Verificar que se guardó en localStorage
    expect(localStorage.getItem('pethealth_token')).toBe('fake-token');
    expect(localStorage.getItem('pethealth_user')).toBeTruthy();
  });

  it('debe limpiar el estado y localStorage al hacer logout', async () => {
    // Simular un estado inicial autenticado
    localStorage.setItem('pethealth_token', 'initial-token');
    localStorage.setItem('pethealth_user', JSON.stringify({
      id: '1', username: 'testuser', rol: { name: 'veterinario' }
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // El estado inicial debe ser autenticado
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

    // Ejecutar logout
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    // Verificar que el estado cambió a no autenticado
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Verificar que localStorage se limpió
    expect(localStorage.getItem('pethealth_token')).toBeNull();
    expect(localStorage.getItem('pethealth_user')).toBeNull();
  });
});
