import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { getPropietarios } from '../../../services/propietarios.service';
import { Owner } from '../types';

export function OwnerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      try {
        const response = await getPropietarios();
        const owners = response.data.map((user: any) => ({
          id: user.id,
          firstName: user.username,
          lastName: '',
          identification: user.identification || 'N/A',
          email: user.email,
          phone: user.phone || 'N/A',
        }));

        const filtered = owners.filter((o: Owner) => 
          `${o.firstName} ${o.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.identification.includes(searchTerm) ||
          o.phone.includes(searchTerm)
        );
        setResults(filtered);
      } catch (error) {
        console.error('Error searching owners:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms debounce (< 2s)

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/owners/${id}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#A8DADC] focus:border-[#A8DADC] sm:text-sm transition-all"
          placeholder="Buscar propietario (Mínimo 3 caracteres)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => {
            if (searchTerm.length >= 3) setIsOpen(true);
          }}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Loader2 className="h-5 w-5 text-[#A8DADC] animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto">
            {results.length > 0 ? (
              results.map((owner) => (
                <li 
                  key={owner.id}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                  onClick={() => handleSelect(owner.id)}
                >
                  <div className="font-medium text-slate-800">{owner.firstName} {owner.lastName}</div>
                  <div className="flex gap-3 mt-1 text-xs text-slate-500">
                    <span>ID: {owner.identification}</span>
                    <span>•</span>
                    <span>Tel: {owner.phone}</span>
                  </div>
                </li>
              ))
            ) : !isLoading ? (
              <li className="px-4 py-8 text-center text-slate-500 text-sm">
                No se encontraron resultados
              </li>
            ) : null}
          </ul>
        </div>
      )}
    </div>
  );
}
