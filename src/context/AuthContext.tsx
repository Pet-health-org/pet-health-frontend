import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'Administrador' | 'Veterinario' | 'Recepcionista';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pethealth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [auditLog, setAuditLog] = useState<any[]>([]);

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('pethealth_user', JSON.stringify(newUser));
    logAction('Inicio de sesión', newUser.id);
  };

  const logout = () => {
    if (user) logAction('Cierre de sesión', user.id);
    setUser(null);
    localStorage.removeItem('pethealth_user');
  };

  const logAction = (action: string, userId: string, details?: any) => {
    const entry = {
      id: Math.random().toString(36).substr(2, 5),
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLog(prev => [entry, ...prev]);
    console.log('Audit Log:', entry);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
