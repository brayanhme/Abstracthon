import React from 'react';
import { Reservation } from '../types';
import { Ticket, Navigation, CalendarX } from 'lucide-react';

interface ReservationsViewProps {
  reservations?: Reservation[];
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  reservations = []
}) => {
  return (
    <section id="reservas" className="scroll-mt-24 space-y-8 pt-8 border-t border-[#1E3A8A]/10">
      
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
          Muestra el código <span className="font-bold text-[#FF7A00]">#QM-XXXX</span> en la sucursal indicada para retirar tu pedido.
        </p>
      </div>

      {/* Grid 2 Columnas (lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda (lg:col-span-7): Lista de reservas o estado vacío */}
        <div className="lg:col-span-7 space-y-4">
          {reservations.length > 0 ? (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div key={res.code} className="clean-card p-5">
                  <span className="font-mono font-bold text-[#FF7A00]">#{res.code}</span>
                  <h3 className="font-bold text-[#1E3A8A]">{res.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="clean-card p-12 text-center text-[#526384] space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFE1C6]/60 text-[#FF7A00] flex items-center justify-center mx-auto">
                <CalendarX className="w-7 h-7" />
              </div>
              <p className="font-heading font-bold text-lg text-[#1E3A8A]">
                No tienes reservas activas por el momento
              </p>
              <p className="text-xs text-[#526384] max-w-sm mx-auto">
                Tus pedidos y códigos de retiro aparecerán aquí en cuanto realices una reserva.
              </p>
            </div>
          )}
        </div>

        {/* Columna Derecha (lg:col-span-5): Mapa Vectorial de Cochabamba */}
        <div className="lg:col-span-5 space-y-5">
          <div className="clean-card p-6 bg-[#FFFFFF] space-y-4 shadow-md border-t-4 border-t-[#FF7A00]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00]">
                Zona de Cobertura
              </span>
              <h3 className="font-heading font-extrabold text-xl text-[#1E3A8A]">
                Cochabamba Centro y Alrededores
              </h3>
            </div>

            {/* Mapa Vectorial limpio de Cochabamba */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1E3A8A]/10 bg-[#FFFBF7]">
              <div className="relative w-full h-56 sm:h-64">
                <svg 
                  viewBox="0 0 400 240" 
                  className="w-full h-full object-cover"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="400" height="240" fill="#F8F6F0" />
                  
                  {/* Parque Tunari Norte */}
                  <path d="M0 0 L400 0 L400 35 Q300 45 200 30 Q100 20 0 35 Z" fill="#E2EED9" />
                  <text x="200" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#6B8F5E" text-anchor="middle" letterSpacing="2">PARQUE NACIONAL TUNARI</text>

                  {/* Laguna Alalay */}
                  <ellipse cx="320" cy="180" rx="42" ry="24" fill="#CDE5FA" stroke="#9EC5E8" strokeWidth="2" />
                  <text x="320" y="183" font-family="sans-serif" font-size="8" font-weight="600" fill="#1E3A8A" text-anchor="middle">Laguna Alalay</text>

                  {/* Río Rocha */}
                  <path 
                    d="M 390 120 Q 300 110 230 115 T 140 100 T 50 105 T 0 95" 
                    fill="none" 
                    stroke="#9EC5E8" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                  />
                  <text x="75" y="96" font-family="sans-serif" font-size="7" fill="#526384" fontStyle="italic">Río Rocha</text>

                  {/* Avenidas */}
                  <line x1="0" y1="130" x2="160" y2="130" stroke="#FFE1C6" strokeWidth="4" />
                  <text x="60" y="125" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. Blanco Galindo</text>

                  <line x1="100" y1="65" x2="350" y2="65" stroke="#FFE1C6" strokeWidth="4" />
                  <text x="230" y="60" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. América</text>

                  <line x1="200" y1="65" x2="200" y2="160" stroke="#FFE1C6" strokeWidth="4" />
                  <line x1="120" y1="140" x2="320" y2="140" stroke="#FFE1C6" strokeWidth="3.5" />
                  <text x="250" y="136" font-family="sans-serif" font-size="7" font-weight="bold" fill="#526384">Av. Heroínas</text>

                  {/* Cristo de la Concordia */}
                  <circle cx="360" cy="95" r="7" fill="#1E3A8A" />
                  <text x="360" y="83" font-family="sans-serif" font-size="7" font-weight="bold" fill="#1E3A8A" text-anchor="middle">Cristo de la Concordia</text>

                  {/* Pin central referencial */}
                  <circle cx="200" cy="115" r="6" fill="#FF7A00" stroke="white" strokeWidth="2" />
                </svg>

                <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-[#1E3A8A] border border-[#1E3A8A]/10 shadow-xs flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#FF7A00]" />
                  <span>Cochabamba Centro</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#526384] text-center">
              Los puntos de retiro de cada pedido se activarán sobre el mapa cuando tengas reservas activas.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
