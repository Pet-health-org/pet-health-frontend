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
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Time for inactivity logout (e.g., 15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pethealth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pethealth_token');
  });
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pethealth_token');
    localStorage.removeItem('pethealth_user');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (token) {
      timeoutRef.current = setTimeout(() => {
        console.log('Logging out due to inactivity');
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [token, logout]);

  const fetchProfile = useCallback(async (authToken: string) => {
    try {
      // Temporarily set token in axios for this request
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

  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('pethealth_token', newToken);
    await fetchProfile(newToken);
    setIsLoading(false);
  };

  // Check token and setup inactivity listeners
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

    // Inactivity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    if (token) {
      activityEvents.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
      });
      resetInactivityTimer();
    }

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [token, user, fetchProfile, logout, resetInactivityTimer]);

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
