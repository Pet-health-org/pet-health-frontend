import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, Hash, Dog, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type SearchResult = {
  id: string;
  type: 'owner' | 'pet' | 'staff';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  url: string;
};

export function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchData = async () => {
      if (searchTerm.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      
      try {
        const lowerTerm = searchTerm.toLowerCase();
        let searchResults: SearchResult[] = [];

        // 1. Search Propietarios
        const propRes = await api.get('/propietarios');
        const owners = propRes.data.filter((o: any) => 
          (o.nombreCompleto || '').toLowerCase().includes(lowerTerm) ||
          (o.numeroIdentificacion || '').includes(lowerTerm) ||
          (o.telefono || '').includes(lowerTerm) ||
          (o.username || '').toLowerCase().includes(lowerTerm)
        );

        searchResults.push(...owners.map((o: any) => ({
          id: o.id,
          type: 'owner' as const,
          title: o.nombreCompleto || o.username || 'Propietario',
          subtitle: `Doc: ${o.numeroIdentificacion || 'N/A'} - Tel: ${o.telefono || 'N/A'}`,
          icon: <User size={14} className="text-blue-500" />,
          url: `/owners/${o.id}`
        })));

        // 2. Search Mascotas
        const petRes = await api.get('/mascotas');
        const pets = petRes.data.filter((p: any) => 
          (p.nombre || '').toLowerCase().includes(lowerTerm) ||
          (p.especie?.nombre || '').toLowerCase().includes(lowerTerm) ||
          (p.raza?.nombre || '').toLowerCase().includes(lowerTerm)
        );

        searchResults.push(...pets.map((p: any) => ({
          id: p.id,
          type: 'pet' as const,
          title: p.nombre || 'Mascota',
          subtitle: `${p.especie?.nombre || 'Especie'} - ${p.raza?.nombre || 'Raza'}`,
          icon: <Dog size={14} className="text-emerald-500" />,
          url: `/pets/${p.id}`
        })));

        // 3. Search Staff (Veterinarios, Recepcionistas, Admins)
        const [vets, recs, admins] = await Promise.all([
          api.get('/veterinarios').catch(() => ({ data: [] })),
          api.get('/recepcionistas').catch(() => ({ data: [] })),
          api.get('/admin').catch(() => ({ data: [] }))
        ]);

        const allStaff = [...vets.data, ...recs.data, ...admins.data];
        const staff = allStaff.filter((s: any) => 
          (s.username || '').toLowerCase().includes(lowerTerm) ||
          (s.email || '').toLowerCase().includes(lowerTerm) ||
          (s.nombreCompleto || '').toLowerCase().includes(lowerTerm)
        );

        searchResults.push(...staff.map((s: any) => ({
          id: s.id,
          type: 'staff' as const,
          title: s.username || s.nombreCompleto || 'Staff',
          subtitle: `${s.rol?.name?.toUpperCase() || 'PERSONAL'} - ${s.email}`,
          icon: <Shield size={14} className="text-purple-500" />,
          url: `/staff`
        })));

        setResults(searchResults.slice(0, 10)); // Limit to 10 results
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(url);
  };

  return (
    <div className="relative w-full max-w-lg z-40" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar pacientes, propietarios o personal..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A2540] focus:bg-white shadow-inner transition-all text-sm font-medium text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.length >= 3) setIsOpen(true);
          }}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#0A2540] rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && searchTerm.length >= 3 && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                Resultados de búsqueda
              </div>
              {results.map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3"
                  onClick={() => handleSelect(item.url)}
                >
                  <div className="mt-0.5 p-1.5 bg-slate-100 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-[#0A2540] text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-sm font-medium text-slate-600">No se encontraron resultados</p>
              <p className="text-xs text-slate-400 mt-1">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
