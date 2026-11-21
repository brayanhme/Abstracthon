import React, { useState, useCallback } from 'react';
import { 
  OfferProduct, 
  CompostLot, 
  UserReservation, 
  UserProfile, 
  ToastMessage 
} from './types';
import { 
  INITIAL_COMPANIES, 
  INITIAL_OFFERS, 
  INITIAL_COMPOST, 
  INITIAL_RESERVATIONS 
} from './data/mockData';
import { Header } from './components/Header';
import { ExploreView } from './components/ExploreView';
import { ProductDrawer } from './components/ProductDrawer';
import { CompaniesView } from './components/CompaniesView';
import { CompostView } from './components/CompostView';
import { ReservationsView } from './components/ReservationsView';
import { LoginModal } from './components/LoginModal';
import { ToastContainer } from './components/Toast';

export function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'explorar' | 'empresas' | 'composta' | 'reservas'>('explorar');

  // Master data state
  const [companies] = useState(INITIAL_COMPANIES);
  const [offers, setOffers] = useState<OfferProduct[]>(INITIAL_OFFERS);
  const [compostLots, setCompostLots] = useState<CompostLot[]>(INITIAL_COMPOST);
  const [reservations, setReservations] = useState<UserReservation[]>(INITIAL_RESERVATIONS);

  // Detail Drawer state
  const [selectedProduct, setSelectedProduct] = useState<OfferProduct | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Company Profile selection state
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Selected reservation code for the map panel
  const [selectedResCode, setSelectedResCode] = useState<string | null>(
    INITIAL_RESERVATIONS.length > 0 ? INITIAL_RESERVATIONS[0].code : null
  );

  // User state
  const [user, setUser] = useState<UserProfile>({
    name: 'Carlos Mendoza',
    emailOrPhone: 'carlos.mendoza@cochabamba.bo',
    isLoggedIn: false
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to generate unique order code #QM-XXXX
  const generateReservationCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `QM-${randomNum}`;
  };

  // Handler: Reserve an Offer Product
  const handleReserveProduct = useCallback((product: OfferProduct) => {
    if (product.stock <= 0) {
      addToast('Agotado', 'Este producto ya no cuenta con unidades disponibles.', 'warning');
      return;
    }

    const company = companies.find(c => c.id === product.companyId);
    const newCode = generateReservationCode();

    // 1. Decrement stock
    setOffers(prev => prev.map(item => {
      if (item.id === product.id) {
        return { ...item, stock: Math.max(0, item.stock - 1) };
      }
      return item;
    }));

    // 2. Create reservation
    const newReservation: UserReservation = {
      code: newCode,
      companyId: product.companyId,
      biz: product.biz,
      title: product.title,
      qty: 1,
      totalPaid: product.newPrice,
      pickupWindow: product.time,
      zone: product.zone,
      address: company?.address || product.zone,
      reference: `Presentar el código #${newCode} en caja. Pedido preparado para rescate alimentario.`,
      coords: company?.coords || { lat: -17.3895, lng: -66.1568 },
      status: 'Listo para recoger',
      type: 'rescate',
      createdAt: 'Hace un momento'
    };

    setReservations(prev => [newReservation, ...prev]);
    setSelectedResCode(newCode);

    // 3. Feedback and navigate
    addToast(
      '¡Reserva Confirmada!',
      `Has reservado "${product.title}" por Bs. ${product.newPrice}. Código: #${newCode}`,
      'success'
    );
    setActiveTab('reservas');
  }, [companies, addToast]);

  // Handler: Request a Compost Lot
  const handleRequestCompost = useCallback((lot: CompostLot) => {
    if (lot.stock <= 0) {
      addToast('Agotado', 'Este lote de biomasa ya ha sido asignado.', 'warning');
      return;
    }

    const company = companies.find(c => c.id === lot.companyId);
    const newCode = generateReservationCode();

    // 1. Decrement stock
    setCompostLots(prev => prev.map(item => {
      if (item.id === lot.id) {
        return { ...item, stock: Math.max(0, item.stock - 1) };
      }
      return item;
    }));

    // 2. Create reservation
    const newReservation: UserReservation = {
      code: newCode,
      companyId: lot.companyId,
      biz: company?.name || lot.source,
      title: `${lot.title} (${lot.unit})`,
      qty: 1,
      totalPaid: lot.price,
      pickupWindow: 'Hoy o Mañana 08:30 - 18:00',
      zone: company?.zone || 'Cochabamba',
      address: company?.address || 'Planta de acopio Cochabamba',
      reference: `Área de logística y sustentabilidad. Indicar código #${newCode} para cargar el lote.`,
      coords: company?.coords || { lat: -17.3895, lng: -66.1568 },
      status: 'Listo para recoger',
      type: 'composta',
      createdAt: 'Hace un momento'
    };

    setReservations(prev => [newReservation, ...prev]);
    setSelectedResCode(newCode);

    addToast(
      'Lote Orgánico Asignado',
      `Lote para ${lot.useType} registrado con éxito. Código: #${newCode}`,
      'success'
    );
    setActiveTab('reservas');
  }, [companies, addToast]);

  // Handler: Complete a reservation ("Ya lo recogí")
  const handleCompleteReservation = useCallback((code: string) => {
    setReservations(prev => prev.filter(r => r.code !== code));
    addToast('¡Retiro Completado!', `Has confirmado la entrega del pedido #${code}. ¡Gracias por ser parte del cambio!`, 'success');
  }, [addToast]);

  // Handler: Open Product Drawer
  const handleOpenDrawer = useCallback((product: OfferProduct) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  }, []);

  // Handler: View Company Profile
  const handleViewCompany = useCallback((companyId: string) => {
    setSelectedCompanyId(companyId);
    setActiveTab('empresas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handler: Login
  const handleLogin = useCallback((newUser: UserProfile) => {
    setUser(newUser);
    addToast('Sesión Iniciada', `¡Bienvenido de nuevo, ${newUser.name}!`, 'success');
  }, [addToast]);

  const handleLogout = useCallback(() => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    addToast('Sesión Cerrada', 'Has cerrado tu sesión de usuario.', 'info');
  }, [addToast]);

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-between selection:bg-[#FFE1C6] selection:text-[#FF7A00]">
      
      {/* Encabezado fijo con burbujas didácticas */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reservationsCount={reservations.length}
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onSelectCompany={setSelectedCompanyId}
      />

      {/* Contenido Principal según pestaña activa */}
      <main className="flex-1 pb-16">
        {activeTab === 'explorar' && (
          <ExploreView
            offers={offers}
            companies={companies}
            onSelectProduct={handleOpenDrawer}
            onReserve={handleReserveProduct}
            onViewCompany={handleViewCompany}
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
            onReserveProduct={handleReserveProduct}
            onRequestCompost={handleRequestCompost}
          />
        )}

        {activeTab === 'composta' && (
          <CompostView
            compostLots={compostLots}
            companies={companies}
            onRequestLot={handleRequestCompost}
            onViewCompany={handleViewCompany}
          />
        )}

        {activeTab === 'reservas' && (
          <ReservationsView
            reservations={reservations}
            selectedCode={selectedResCode}
            onSelectReservation={setSelectedResCode}
            onCompleteReservation={handleCompleteReservation}
            companies={companies}
            onExploreMore={() => setActiveTab('explorar')}
          />
        )}
      </main>

      {/* Drawer lateral de detalle */}
      <ProductDrawer
        product={selectedProduct}
        company={companies.find(c => c.id === selectedProduct?.companyId)}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onReserve={handleReserveProduct}
        onViewCompany={handleViewCompany}
      />

      {/* Modal de Inicio de Sesión */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Contenedor de notificaciones flotantes (Toasts) */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />

      {/* Footer minimalista */}
      <footer className="border-t border-[#1E3A8A]/10 bg-[#FFFFFF] py-8 text-center text-xs text-[#526384]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-[#1E3A8A] text-sm">Q'omer</span>
            <span>— Rescate alimentario y economía circular en Cochabamba, Bolivia</span>
          </div>
          <p className="text-[11px] text-[#526384]">
            Paleta Oficial Fresh Citrus (60-30-10) • Diseñado para la Llajta
          </p>
        </div>
      </footer>

    </div>
  );
}
export default App;
