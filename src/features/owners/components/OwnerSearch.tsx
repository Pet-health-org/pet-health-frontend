import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOwners } from '../hooks/useOwners';
import { Owner } from '../types';

export function OwnerSearch() {
  const { owners, isLoading } = useOwners();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Owner[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = owners.filter(o => 
        o.firstName.toLowerCase().includes(lowerTerm) ||
        o.lastName.toLowerCase().includes(lowerTerm) ||
        o.identification.includes(lowerTerm) ||
        o.phone.includes(lowerTerm)
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchTerm, owners]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/owners/${id}`);
  };

  return (
    <div className="relative w-full max-w-md z-40" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Buscar propietario (nombre, doc, tel)..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8DADC] focus:border-transparent shadow-sm transition-all text-sm"
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
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((owner) => (
                <div 
                  key={owner.id}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                  onClick={() => handleSelect(owner.id)}
                >
                  <div className="flex items-center gap-2 font-medium text-[#0A2540] mb-1">
                    <User size={14} className="text-slate-400" />
                    {owner.firstName} {owner.lastName}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pl-5">
                    <div className="flex items-center gap-1">
                      <Hash size={12} /> {owner.identification}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={12} /> {owner.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
