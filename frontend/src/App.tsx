import React, { useState } from 'react';
import { OfferProduct, Company, CompostLot, Reservation } from './types';
import { 
  PREVIEW_COMPANIES, 
  PREVIEW_OFFERS, 
  PREVIEW_COMPOST, 
  PREVIEW_RESERVATIONS 
} from './services/previewTemplates';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { ProductDrawer } from './components/ProductDrawer';
import { CompaniesView } from './components/CompaniesView';
import { CompostView } from './components/CompostView';
import { ReservationsView } from './components/ReservationsView';
import { LoginModal } from './components/LoginModal';

export function App() {
  // Pestaña visual activa
  const [activeTab, setActiveTab] = useState<'explorar' | 'empresas' | 'composta' | 'reservas'>('explorar');

  // Modo previsualización de componentes (permite ver el diseño con tarjetas de muestra sin persistencia)
  const [showPreviewData, setShowPreviewData] = useState<boolean>(true);

  // Estados visuales (Aquí el equipo de Backend conectará sus peticiones API / React Query)
  // Ejemplo: useEffect(() => { api.getOffers().then(setOffers) }, [])
  const offers: OfferProduct[] = showPreviewData ? PREVIEW_OFFERS : [];
  const companies: Company[] = showPreviewData ? PREVIEW_COMPANIES : [];
  const compostLots: CompostLot[] = showPreviewData ? PREVIEW_COMPOST : [];
  const reservations: Reservation[] = showPreviewData ? PREVIEW_RESERVATIONS : [];

  // Control del Drawer lateral visual
  const [selectedProduct, setSelectedProduct] = useState<OfferProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Control de perfil de empresa
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Modal de inicio de sesión
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleOpenDrawer = (product: OfferProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleViewCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setActiveTab('empresas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-between selection:bg-[#FFE1C6] selection:text-[#FF7A00]">
      
      {/* 1. Encabezado con Burbujas Didácticas */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'empresas') setSelectedCompanyId(null);
          setActiveTab(tab);
        }}
        reservationsCount={reservations.length}
        userName={userName}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsLoginOpen(true)}
        showPreviewData={showPreviewData}
        onTogglePreview={() => setShowPreviewData(prev => !prev)}
      />

      {/* 2. Vistas según la navegación activa */}
      <main className="flex-1 pb-16">
        {activeTab === 'explorar' && (
          <ExploreView
            offers={offers}
            onSelectProduct={handleOpenDrawer}
          />
        )}

        {activeTab === 'empresas' && (
          <CompaniesView
            companies={companies}
            offers={offers}
            compostLots={compostLots}
            selectedCompanyId={selectedCompanyId}
            onSelectCompany={setSelectedCompanyId}
            onSelectProduct={handleOpenDrawer}
          />
        )}

        {activeTab === 'composta' && (
          <CompostView
            compostLots={compostLots}
          />
        )}

        {activeTab === 'reservas' && (
          <ReservationsView
            reservations={reservations}
            onExploreMore={() => setActiveTab('explorar')}
          />
        )}
      </main>

      {/* 3. Drawer lateral de detalle */}
      <ProductDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onViewCompany={handleViewCompany}
      />

      {/* 4. Modal de autenticación */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* 5. Pie de página minimalista */}
      <footer className="border-t border-[#1E3A8A]/10 bg-[#FFFFFF] py-8 text-center text-xs text-[#526384]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#1E3A8A] text-sm">Q'omer</span>
            <span>— Rescate alimentario y economía circular en Cochabamba, Bolivia</span>
          </div>
          <p className="text-[11px] text-[#526384]">
            Paleta Oficial Fresh Citrus (60-30-10) • Frontend desacoplado
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
