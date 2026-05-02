import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface DevelopmentAlertProps {
  moduleName: string;
  customMessage?: string;
  title?: string;
  variant?: 'warning' | 'info';
}

export function DevelopmentAlert({ moduleName, customMessage, title, variant = 'warning' }: DevelopmentAlertProps) {
  const isInfo = variant === 'info';
  
  const colors = {
    container: isInfo ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200',
    iconBg: isInfo ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600',
    titleText: isInfo ? 'text-blue-900' : 'text-amber-900',
    bodyText: isInfo ? 'text-blue-700' : 'text-amber-700',
  };

  return (
    <div className={`${colors.container} border rounded-xl p-4 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500`}>
      <div className={`p-2 rounded-lg ${colors.iconBg}`}>
        {isInfo ? <Info size={24} /> : <AlertCircle size={24} />}
      </div>
      <div>
        <h3 className={`font-bold ${colors.titleText}`}>{title || 'Módulo en Desarrollo'}</h3>
        <p className={`text-sm ${colors.bodyText}`}>
          {customMessage ? (
            customMessage
          ) : (
            <>
              El módulo de <strong>{moduleName}</strong> está actualmente en fase de integración con el backend. 
              Los datos mostrados pueden ser temporales o limitados.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
