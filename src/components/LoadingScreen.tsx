import React from 'react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        <div className="absolute inset-0 border-4 border-[#A8DADC] border-t-[#0A2540] rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-slate-200 border-b-[#A8DADC] rounded-full animate-spin animation-delay-200"></div>
        <div className="absolute inset-4 bg-[#0A2540] rounded-full animate-pulse opacity-20"></div>
      </div>
      <h3 className="text-[#0A2540] font-bold text-xl mb-2 animate-pulse">Cargando Módulo</h3>
      <p className="text-slate-500 font-medium text-sm">Preparando la información...</p>
    </div>
  );
}
