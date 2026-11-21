import React from 'react';
import { UserReservation, Company } from '../types';
import { 
  Ticket, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  QrCode, 
  AlertCircle, 
  Navigation, 
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface ReservationsViewProps {
  reservations: UserReservation[];
  selectedCode: string | null;
  onSelectReservation: (code: string) => void;
  onCompleteReservation: (code: string) => void;
  companies: Company[];
  onExploreMore: () => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations,
  selectedCode,
  onSelectReservation,
  onCompleteReservation,
  companies,
  onExploreMore
}) => {
  // Selected reservation or default to first
  const activeReservation = reservations.find(r => r.code === selectedCode) || reservations[0] || null;

  // Company logo map
  const companyLogoMap = React.useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach(c => map.set(c.id, c.logoSvg));
    return map;
  }, [companies]);

  if (reservations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-[#FFE1C6] text-[#FF7A00] flex items-center justify-center mx-auto shadow-inner">
          <Ticket className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-[#1E3A8A] font-heading">
            No tienes reservas activas por ahora
          </h2>
          <p className="text-[#526384] max-w-md mx-auto text-sm sm:text-base">
            Explora las ofertas del día en panaderías, supermercados o lotes de composta y reserva tus alimentos a precio de rescate.
          </p>
        </div>
        <button
          onClick={onExploreMore}
          className="px-6 py-3 rounded-full bg-[#FF7A00] hover:bg-[#E06800] text-white font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Explorar Ofertas Disponibles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold uppercase tracking-wide">
          <Ticket className="w-3.5 h-3.5" />
          <span>Gestión de Pedidos & Retiros</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] font-heading">
          Mis Reservas y Puntos de Retiro
        </h1>
        <p className="text-sm text-[#526384]">
          Muestra el código <span className="font-bold text-[#FF7A00]">#QM-XXXX</span> en la sucursal indicada dentro del horario para retirar tu pedido.
        </p>
      </div>

      {/* Grid 2 Columnas (lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda (lg:col-span-7): Lista de reservas activas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#526384] uppercase tracking-wider px-1">
            <span>Reservas pendientes ({reservations.length})</span>
            <span>Haz clic para ver punto de retiro</span>
          </div>

          <div className="space-y-4">
            {reservations.map((res) => {
              const isSelected = activeReservation?.code === res.code;
              const logoSvg = companyLogoMap.get(res.companyId);

              return (
                <div
                  key={res.code}
                  onClick={() => onSelectReservation(res.code)}
                  className={`clean-card p-5 cursor-pointer transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-2 border-[#FF7A00] shadow-md bg-[#FFFBF7]'
                      : 'hover:border-[#1E3A8A]/30 bg-[#FFFFFF]'
                  }`}
                >
                  {/* Indicador de selección */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF7A00] rounded-bl-lg" />
                  )}

                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Logo + Información principal */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      {logoSvg && (
                        <div 
                          className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#1E3A8A]/10 flex-shrink-0"
                          dangerouslySetInnerHTML={{ __html: logoSvg }}
                        />
                      )}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1E3A8A] truncate">
                            {res.biz}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6B8F5E]/15 text-[#6B8F5E]">
                            {res.status}
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-base text-[#1E3A8A] leading-tight line-clamp-1">
                          {res.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#526384] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
                            <span>{res.pickupWindow}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#526384]" />
                            <span className="truncate">{res.zone}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Código de pedido y Total en Bs. */}
                    <div className="text-right flex-shrink-0 space-y-1">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20">
                        #{res.code}
                      </span>
                      <p className="font-heading font-extrabold text-lg text-[#1E3A8A]">
                        Bs. {res.totalPaid}
                      </p>
                      <p className="text-[10px] text-[#526384] font-medium">
                        {res.qty} {res.qty === 1 ? 'unidad' : 'unidades'}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onExploreMore}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-[#1E3A8A]/20 text-[#1E3A8A] hover:border-[#FF7A00] hover:text-[#FF7A00] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Rescatar más alimentos hoy</span>
          </button>
        </div>

        {/* Columna Derecha (lg:col-span-5 sticky top-28): Panel de ubicación y retiro */}
        {activeReservation && (
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
            <div className="clean-card p-6 bg-[#FFFFFF] space-y-6 shadow-md border-t-4 border-t-[#FF7A00]">
              
              {/* Título de la sucursal */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00]">
                  Punto oficial de entrega
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#1E3A8A]">
                  {activeReservation.biz}
                </h3>
              </div>

              {/* Mapa Vectorial interactivo y limpio de Cochabamba */}
              <div className="relative rounded-2xl overflow-hidden border border-[#1E3A8A]/10 bg-[#FFFBF7]">
                <div className="relative w-full h-52 sm:h-60">
                  <svg 
                    viewBox="0 0 400 240" 
                    className="w-full h-full object-cover"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Fondo mapa / Valle central Cochabamba */}
                    <rect width="400" height="240" fill="#F8F6F0" />
                    
                    {/* Zonas verdes / Parque Tunari norte / Colina San Sebastián */}
                    <path d="M0 0 L400 0 L400 35 Q300 45 200 30 Q100 20 0 35 Z" fill="#E2EED9" />
                    <text x="200" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#6B8F5E" text-anchor="middle" letter-spacing="2">PARQUE NACIONAL TUNARI</text>

                    {/* Laguna Alalay en el sudeste */}
                    <ellipse cx="320" cy="180" rx="42" ry="24" fill="#CDE5FA" stroke="#9EC5E8" stroke-width="2" />
                    <text x="320" y="183" font-family="sans-serif" font-size="8" font-weight="600" fill="#1E3A8A" text-anchor="middle">Laguna Alalay</text>

                    {/* Río Rocha (atraviesa Cochabamba de este a oeste) */}
                    <path 
                      d="M 390 120 Q 300 110 230 115 T 140 100 T 50 105 T 0 95" 
                      fill="none" 
                      stroke="#9EC5E8" 
                      stroke-width="5" 
                      stroke-linecap="round"
                    />
                    <text x="75" y="96" font-family="sans-serif" font-size="7" fill="#526384" font-style="italic">Río Rocha</text>

                    {/* Calles principales y Avenidas de Cochabamba */}
                    {/* Av. Blanco Galindo */}
                    <line x1="0" y1="130" x2="160" y2="130" stroke="#FFE1C6" stroke-width="4" />
                    <text x="60" y="125" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. Blanco Galindo</text>

                    {/* Av. América (Norte) */}
                    <line x1="100" y1="65" x2="350" y2="65" stroke="#FFE1C6" stroke-width="4" />
                    <text x="230" y="60" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. América</text>

                    {/* Av. Ballivián / El Prado */}
                    <line x1="200" y1="65" x2="200" y2="160" stroke="#FFE1C6" stroke-width="4" />
                    <text x="206" y="115" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384" transform="rotate(90 206 115)">El Prado</text>

                    {/* Av. Heroínas / Centro */}
                    <line x1="120" y1="140" x2="320" y2="140" stroke="#FFE1C6" stroke-width="3.5" />
                    <text x="250" y="136" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. Heroínas</text>

                    {/* Cristo de la Concordia (Este / Cerro San Pedro) */}
                    <circle cx="360" cy="95" r="7" fill="#1E3A8A" />
                    <text x="360" y="83" font-family="sans-serif" font-size="7" font-weight="bold" fill="#1E3A8A" text-anchor="middle">Cristo de la Concordia</text>

                    {/* Cuadrícula urbana sutil */}
                    <line x1="160" y1="65" x2="160" y2="170" stroke="#E5E7EB" stroke-width="1.5" />
                    <line x1="240" y1="65" x2="240" y2="170" stroke="#E5E7EB" stroke-width="1.5" />
                    <line x1="280" y1="65" x2="280" y2="170" stroke="#E5E7EB" stroke-width="1.5" />
                    <line x1="130" y1="100" x2="330" y2="100" stroke="#E5E7EB" stroke-width="1.5" />

                    {/* PIN DESTACADO CON EFECTO ONDA / PULSO */}
                    <g transform="translate(195, 120)">
                      <circle cx="0" cy="0" r="16" fill="#FF7A00" opacity="0.25">
                        <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="0" cy="0" r="7" fill="#FF7A00" stroke="white" stroke-width="2" />
                      <circle cx="0" cy="0" r="2.5" fill="white" />
                    </g>
                  </svg>

                  {/* Insignia de mapa flotante */}
                  <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#1E3A8A] border border-[#1E3A8A]/10 shadow-xs flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#FF7A00]" />
                    <span>Cochabamba Centro</span>
                  </div>
                </div>
              </div>

              {/* Dirección y referencia exacta */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E3A8A] block">{activeReservation.address}</span>
                    <span className="text-[#526384]">{activeReservation.zone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-[#FFFBF7] p-3 rounded-xl border border-[#1E3A8A]/10">
                  <AlertCircle className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                  <p className="text-[#526384] leading-relaxed">
                    <strong className="text-[#1E3A8A]">Indicación de retiro: </strong>
                    {activeReservation.reference}
                  </p>
                </div>
              </div>

              {/* Caja destacada con el código #QM-XXXX para mostrar en tienda */}
              <div className="bg-gradient-to-br from-[#FFE1C6]/70 to-[#FFFBF7] p-5 rounded-2xl border-2 border-dashed border-[#FF7A00]/50 text-center space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#526384]">
                  Muestra este código en caja al retirar
                </p>
                <div className="flex items-center justify-center gap-3">
                  <QrCode className="w-7 h-7 text-[#FF7A00]" />
                  <span className="font-mono font-extrabold text-3xl sm:text-4xl text-[#FF7A00] tracking-wider">
                    #{activeReservation.code}
                  </span>
                </div>
                <p className="text-[11px] text-[#526384]">
                  Total a pagar en tienda: <strong className="text-[#1E3A8A]">Bs. {activeReservation.totalPaid}</strong> (Efectivo o QR Simple)
                </p>
              </div>

              {/* Botón externo "Abrir en Google Maps" y Botón "Ya lo recogí" */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeReservation.coords.lat},${activeReservation.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#FFFBF7] hover:bg-[#FFE1C6]/50 text-[#1E3A8A] border border-[#1E3A8A]/15 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-[#FF7A00]" />
                  <span>Abrir ubicación en Google Maps</span>
                </a>

                <button
                  onClick={() => onCompleteReservation(activeReservation.code)}
                  className="w-full py-3 rounded-xl bg-[#6B8F5E] hover:bg-[#58774d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Ya lo recogí (Finalizar reserva)</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
