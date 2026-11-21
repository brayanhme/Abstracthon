import React from 'react';
import { Leaf, Compass, Store, Sprout, Ticket, User } from 'lucide-react';

interface HeaderProps {
  onOpenLogin?: () => void;
  reservationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  reservationsCount = 0
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFBF7]/90 backdrop-blur-md border-b border-[#1E3A8A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        <a href="#explorar" className="flex items-center gap-3 group select-none flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-[#FF7A00] flex items-center justify-center shadow-md shadow-[#FF7A00]/25 group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-6 h-6 text-white transform -rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#1E3A8A]">
                ReAprovecha
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#526384] -mt-1">
              Cochabamba
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          <a
            href="#explorar"
            className="didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6] transition-all"
          >
            <span className="bubble-dot w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            <Compass className="w-4 h-4" />
            <span>Explorar</span>
          </a>

          <a
            href="#empresas"
            className="didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6] transition-all"
          >
            <span className="bubble-dot w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            <Store className="w-4 h-4" />
            <span>Empresas</span>
          </a>

          <a
            href="#composta"
            className="didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6] transition-all"
          >
            <span className="bubble-dot w-2 h-2 rounded-full bg-[#6B8F5E]"></span>
            <Sprout className="w-4 h-4" />
            <span>Composta</span>
          </a>

          <a
            href="#reservas"
            className="didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6] transition-all"
          >
            <span className="bubble-dot w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            <Ticket className="w-4 h-4" />
            <span>Mis Reservas</span>
            {reservationsCount > 0 && (
              <span className="ml-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF7A00] text-white">
                {reservationsCount}
              </span>
            )}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="bg-[#1E3A8A] hover:bg-[#152a66] text-white text-sm font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Iniciar sesión</span>
          </button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around py-2.5 px-2 border-t border-[#1E3A8A]/5 bg-[#FFFBF7]/95">
        <a
          href="#explorar"
          className="flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg text-[#526384] hover:text-[#FF7A00]"
        >
          <Compass className="w-4 h-4" />
          <span>Explorar</span>
        </a>
        <a
          href="#empresas"
          className="flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg text-[#526384] hover:text-[#FF7A00]"
        >
          <Store className="w-4 h-4" />
          <span>Empresas</span>
        </a>
        <a
          href="#composta"
          className="flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg text-[#526384] hover:text-[#FF7A00]"
        >
          <Sprout className="w-4 h-4" />
          <span>Composta</span>
        </a>
        <a
          href="#reservas"
          className="flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg text-[#526384] hover:text-[#FF7A00]"
        >
          <Ticket className="w-4 h-4" />
          <span>Reservas</span>
        </a>
      </div>
    </header>
  );
};
