import React, { useState } from 'react';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { CompaniesView } from './components/CompaniesView';
import { CompostView } from './components/CompostView';
import { ReservationsView } from './components/ReservationsView';
import { LoginModal } from './components/LoginModal';

export function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-between selection:bg-[#FFE1C6] selection:text-[#FF7A00]">
      
      {/* 1. Encabezado con Burbujas Didácticas */}
      <Header
        onOpenLogin={() => setIsLoginOpen(true)}
        reservationsCount={0}
      />

      {/* 2. Contenido Visual Principal (Estructura Limpia de Frontend) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 flex-1 w-full">
        
        {/* Sección: Explorar Ofertas */}
        <ExploreView />

        {/* Sección: Directorio de Empresas */}
        <CompaniesView />

        {/* Sección: Composta y Economía Circular */}
        <CompostView />

        {/* Sección: Mis Reservas y Mapa de Cochabamba */}
        <ReservationsView />

      </main>

      {/* 3. Modal de Acceso de Usuario */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* 4. Pie de página minimalista */}
      <footer className="border-t border-[#1E3A8A]/10 bg-[#FFFFFF] py-8 text-center text-xs text-[#526384] mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#1E3A8A] text-sm">Q'omer</span>
            <span>— Rescate alimentario y economía circular en Cochabamba, Bolivia</span>
          </div>
          <p className="text-[11px] text-[#526384]">
            Paleta Oficial Fresh Citrus (60-30-10) • Frontend Oficial
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
