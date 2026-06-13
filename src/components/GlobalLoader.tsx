import React, { useState, useEffect } from 'react';
import { Dog } from 'lucide-react';

const LOADING_MESSAGES = [
  "Mejorando Experiencia de usuario...",
  "Cargando Interfaz personalizada...",
  "Configurando entorno de trabajo eficiente..."
];

export function GlobalLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000); // Cambia el texto cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center mb-8">
        {/* El perrito en el centro corriendo */}
        <div className="absolute z-10 text-[#0A2540] animate-bounce">
          <Dog size={48} strokeWidth={2.5} />
        </div>
        
        {/* Círculo de carga con puntos */}
        <div className="relative w-32 h-32 animate-spin">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full left-0 top-0"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div 
                className="w-3.5 h-3.5 bg-[#A8DADC] rounded-full mx-auto"
                style={{
                  opacity: 1 - (i / 12),
                  transform: `scale(${1 - (i / 24)})`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Textos alternantes */}
      <div className="h-8 flex items-center justify-center mb-4 transition-all">
        <p className="text-[#0A2540] font-semibold text-lg animate-pulse text-center px-4">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Barra de progreso indeterminada */}
      <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-[#0A2540] rounded-full animate-progress-indeterminate"></div>
      </div>
    </div>
  );
}
