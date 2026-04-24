import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notify = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      {/* Portal for Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {notifications.map((n) => (
          <Toast 
            key={n.id} 
            {...n} 
            onClose={() => removeNotification(n.id)} 
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ type, title, message, onClose }: Notification & { onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    error: <XCircle className="text-red-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
  };

  const bgColors = {
    success: 'bg-emerald-50/90 border-emerald-100',
    warning: 'bg-amber-50/90 border-amber-100',
    error: 'bg-red-50/90 border-red-100',
    info: 'bg-blue-50/90 border-blue-100',
  };

  return (
    <div className={`pointer-events-auto flex gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-lg shadow-black/5 animate-in slide-in-from-right-full duration-300 ${bgColors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 leading-none mb-1">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full hover:bg-black/5 text-slate-400 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return context;
}
