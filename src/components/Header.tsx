import React from 'react';
import { Leaf, Compass, Store, Sprout, Ticket, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'explorar' | 'empresas' | 'composta' | 'reservas';
  setActiveTab: (tab: 'explorar' | 'empresas' | 'composta' | 'reservas') => void;
  reservationsCount: number;
  user: UserProfile;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSelectCompany: (companyId: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  reservationsCount,
  user,
  onOpenLogin,
  onLogout,
  onSelectCompany
}) => {
  const handleNav = (tab: 'explorar' | 'empresas' | 'composta' | 'reservas') => {
    if (tab === 'empresas') {
      onSelectCompany(null);
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFBF7]/90 backdrop-blur-md border-b border-[#1E3A8A]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. Izquierda (Marca Q'omer) */}
        <div 
          onClick={() => handleNav('explorar')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FF7A00] flex items-center justify-center shadow-md shadow-[#FF7A00]/25 group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-6 h-6 text-white transform -rotate-12 group-hover:rotate-0 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#1E3A8A]">
                Q'omer
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#FF7A00]"></span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#526384] -mt-1">
              Cochabamba
            </p>
          </div>
        </div>

        {/* 2. Centro (Navegación en Burbujas Didácticas) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Burbuja: Explorar */}
          <button
            onClick={() => handleNav('explorar')}
            className={`didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border transition-all ${
              activeTab === 'explorar'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm shadow-[#FF7A00]/30'
                : 'bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6]'
            }`}
          >
            <span className={`bubble-dot w-2 h-2 rounded-full ${activeTab === 'explorar' ? 'bg-white' : 'bg-[#FF7A00]'}`}></span>
            <Compass className="w-4 h-4" />
            <span>Explorar</span>
          </button>

          {/* Burbuja: Empresas */}
          <button
            onClick={() => handleNav('empresas')}
            className={`didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border transition-all ${
              activeTab === 'empresas'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm shadow-[#FF7A00]/30'
                : 'bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6]'
            }`}
          >
            <span className={`bubble-dot w-2 h-2 rounded-full ${activeTab === 'empresas' ? 'bg-white' : 'bg-[#FF7A00]'}`}></span>
            <Store className="w-4 h-4" />
            <span>Empresas</span>
          </button>

          {/* Burbuja: Composta */}
          <button
            onClick={() => handleNav('composta')}
            className={`didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border transition-all ${
              activeTab === 'composta'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm shadow-[#FF7A00]/30'
                : 'bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6]'
            }`}
          >
            <span className={`bubble-dot w-2 h-2 rounded-full ${activeTab === 'composta' ? 'bg-white' : 'bg-[#6B8F5E]'}`}></span>
            <Sprout className="w-4 h-4" />
            <span>Composta</span>
          </button>

          {/* Burbuja: Mis Reservas */}
          <button
            onClick={() => handleNav('reservas')}
            className={`didactic-bubble relative px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 border transition-all ${
              activeTab === 'reservas'
                ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm shadow-[#FF7A00]/30'
                : 'bg-[#FFE1C6]/70 text-[#1E3A8A] border-[#FFE1C6] hover:bg-[#FFE1C6]'
            }`}
          >
            <span className={`bubble-dot w-2 h-2 rounded-full ${activeTab === 'reservas' ? 'bg-white' : 'bg-[#FF7A00]'}`}></span>
            <Ticket className="w-4 h-4" />
            <span>Mis Reservas</span>
            {reservationsCount > 0 && (
              <span className={`ml-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'reservas' ? 'bg-white text-[#FF7A00]' : 'bg-[#FF7A00] text-white'
              }`}>
                {reservationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* 3. Derecha (Acceso Usuario) */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#1E3A8A]/10 px-3.5 py-1.5 rounded-full shadow-sm">
              <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-[#1E3A8A] max-w-[120px] truncate">
                Hola, {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={onLogout}
                title="Cerrar sesión"
                className="text-[#526384] hover:text-[#B91C1C] p-1 rounded-full transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#1E3A8A] hover:bg-[#152a66] text-white text-sm font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Iniciar sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Navegación móvil inferior o secundaria */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-2 border-t border-[#1E3A8A]/5 bg-[#FFFBF7]/95">
        <button
          onClick={() => handleNav('explorar')}
          className={`flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg ${
            activeTab === 'explorar' ? 'text-[#FF7A00] font-bold' : 'text-[#526384]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explorar</span>
        </button>
        <button
          onClick={() => handleNav('empresas')}
          className={`flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg ${
            activeTab === 'empresas' ? 'text-[#FF7A00] font-bold' : 'text-[#526384]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Empresas</span>
        </button>
        <button
          onClick={() => handleNav('composta')}
          className={`flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg ${
            activeTab === 'composta' ? 'text-[#FF7A00] font-bold' : 'text-[#526384]'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Composta</span>
        </button>
        <button
          onClick={() => handleNav('reservas')}
          className={`relative flex flex-col items-center gap-1 text-xs font-medium py-1 px-2.5 rounded-lg ${
            activeTab === 'reservas' ? 'text-[#FF7A00] font-bold' : 'text-[#526384]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Reservas</span>
          {reservationsCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#FF7A00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {reservationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
