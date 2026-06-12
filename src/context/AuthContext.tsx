import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

type Role = 'admin' | 'veterinario' | 'recepcionista' | 'propietario';

interface User {
  id: string;
  username: string;
  email: string;
  rol: {
    name: Role;
    description: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, expiresIn: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pethealth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pethealth_token');
  });
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pethealth_token');
    localStorage.removeItem('pethealth_user');
    localStorage.removeItem('pethealth_expires_at');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const setupExpirationTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const expiresAtStr = localStorage.getItem('pethealth_expires_at');
    if (expiresAtStr && token) {
      const expiresAt = parseInt(expiresAtStr, 10);
      const timeLeft = expiresAt - Date.now();
      
      if (timeLeft <= 0) {
        logout();
      } else {
        timeoutRef.current = setTimeout(() => {
          console.log('Logging out due to token expiration');
          logout();
        }, timeLeft);
      }
    }
  }, [token, logout]);

  const fetchProfile = useCallback(async (authToken: string) => {
    try {
      const response = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('pethealth_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const login = async (newToken: string, expiresIn: number) => {
    setToken(newToken);
    localStorage.setItem('pethealth_token', newToken);
    
    // Guardar tiempo de expiración (expiresIn viene en segundos)
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem('pethealth_expires_at', expiresAt.toString());
    
    await fetchProfile(newToken);
    setIsLoading(false);
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token && !user) {
        try {
          await fetchProfile(token);
        } catch (e) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
    setupExpirationTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [token, user, fetchProfile, logout, setupExpirationTimer]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isAuthenticated: !!token && !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
