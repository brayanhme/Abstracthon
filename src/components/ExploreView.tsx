import React, { useState, useMemo } from 'react';
import { OfferProduct, Company } from '../types';
import { MapPin, Clock, ArrowRight, Sparkles, Filter, AlertCircle } from 'lucide-react';

interface ExploreViewProps {
  offers: OfferProduct[];
  companies: Company[];
  onSelectProduct: (product: OfferProduct) => void;
  onReserve: (product: OfferProduct) => void;
  onViewCompany: (companyId: string) => void;
}

const CATEGORIES = [
  'Todos',
  'Panadería',
  'Lácteos y Helados',
  'Supermercado',
  'Embutidos y Frescos'
] as const;

const ZONES = [
  'Toda Cochabamba',
  'Centro / El Prado',
  'Zona Norte / Av. América',
  'Av. Blanco Galindo',
  'Tiquipaya / Cala Cala'
] as const;

export const ExploreView: React.FC<ExploreViewProps> = ({
  offers,
  companies,
  onSelectProduct,
  onReserve,
  onViewCompany
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedZone, setSelectedZone] = useState<string>('Toda Cochabamba');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map company logos for fast lookup
  const companyLogoMap = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach(c => map.set(c.id, c.logoSvg));
    return map;
  }, [companies]);

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter(item => {
      const matchCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchZone = selectedZone === 'Toda Cochabamba' || item.zone === selectedZone;
      const matchSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.biz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchZone && matchSearch;
    });
  }, [offers, selectedCategory, selectedZone, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Encabezado limpio */}
      <div className="text-center md:text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rescate Alimentario Inteligente</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] font-heading tracking-tight">
          Alimentos frescos de Cochabamba, a mitad de precio.
        </h1>
        <p className="text-base sm:text-lg text-[#526384] max-w-2xl">
          Evitamos el desperdicio conectándote con panaderías, supermercados y empresas locales. Ahorra dinero y cuida el medio ambiente en la Llajta.
        </p>
      </div>

      {/* Barra de Filtros rápidos */}
      <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#1E3A8A]/10 shadow-sm space-y-4">
        
        {/* Selector de zona y buscador */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF7A00] flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#526384]">Zona:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#FFFBF7] border border-[#1E3A8A]/15 text-[#1E3A8A] text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:border-[#FF7A00] cursor-pointer"
            >
              {ZONES.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar marraquetas, queso, helados, PIL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFBF7] border border-[#1E3A8A]/15 rounded-xl pl-9 pr-4 py-2 text-sm text-[#1E3A8A] placeholder-[#526384]/60 outline-none focus:border-[#FF7A00]"
            />
            <Filter className="w-4 h-4 text-[#526384] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Chips horizontales de categorías */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(category => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-[#FFFBF7] text-[#526384] border border-[#1E3A8A]/10 hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-sm text-[#526384]">
        <span>
          Mostrando <strong className="text-[#1E3A8A]">{filteredOffers.length}</strong> ofertas disponibles
        </span>
        {selectedCategory !== 'Todos' || selectedZone !== 'Toda Cochabamba' ? (
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSelectedZone('Toda Cochabamba');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#FF7A00] hover:underline"
          >
            Restablecer filtros
          </button>
        ) : null}
      </div>

      {/* Cuadrícula de tarjetas */}
      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((item) => {
            const discountPct = Math.round(((item.oldPrice - item.newPrice) / item.oldPrice) * 100);
            const isOutOfStock = item.stock <= 0;
            const logoSvg = companyLogoMap.get(item.companyId);

            return (
              <div
                key={item.id}
                className="clean-card overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectProduct(item)}
              >
                <div>
                  {/* Imagen y badges de stock */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Badge de stock flotante superior derecha */}
                    <div className="absolute top-3 right-3">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#B91C1C] text-white shadow-md">
                          Agotado
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFFFFF]/95 text-[#1E3A8A] shadow-md border border-[#1E3A8A]/10 backdrop-blur-sm">
                          Stock: <strong className="text-[#FF7A00]">{item.stock}</strong> disp.
                        </span>
                      )}
                    </div>

                    {/* Badge de descuento flotante superior izquierda */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FF7A00] text-white shadow-md">
                        -{discountPct}%
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-5 space-y-3">
                    
                    {/* Mini-logo SVG de empresa + Nombre clicable + Zona */}
                    <div className="flex items-center gap-2.5">
                      {logoSvg && (
                        <div 
                          className="w-7 h-7 flex-shrink-0 rounded-lg overflow-hidden border border-[#1E3A8A]/10 shadow-xs"
                          dangerouslySetInnerHTML={{ __html: logoSvg }}
                        />
                      )}
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCompany(item.companyId);
                          }}
                          className="text-xs font-bold text-[#1E3A8A] hover:text-[#FF7A00] transition-colors truncate block text-left"
                        >
                          {item.biz}
                        </button>
                        <p className="text-[11px] text-[#526384] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#526384]" />
                          <span className="truncate">{item.zone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Título del paquete */}
                    <h3 className="font-heading font-bold text-lg text-[#1E3A8A] line-clamp-2 group-hover:text-[#FF7A00] transition-colors">
                      {item.title}
                    </h3>

                    {/* Ventana horaria de retiro */}
                    <div className="flex items-center gap-1.5 text-xs text-[#526384] bg-[#FFFBF7] px-2.5 py-1.5 rounded-lg border border-[#1E3A8A]/5">
                      <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>Retiro: <strong className="text-[#1E3A8A]">{item.time}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Precios y Botón Reservar */}
                <div className="p-5 pt-0 border-t border-[#1E3A8A]/5 mt-2 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-[#526384] line-through block">
                      Bs. {item.oldPrice}
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-[#1E3A8A]">
                      Bs. {item.newPrice}
                    </span>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReserve(item);
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#FF7A00] hover:bg-[#E06800] text-white active:scale-95 shadow-[#FF7A00]/25'
                    }`}
                  >
                    <span>Reservar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="clean-card p-12 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-[#526384]/50 mx-auto" />
          <h3 className="text-xl font-bold text-[#1E3A8A] font-heading">
            No se encontraron ofertas en esta búsqueda
          </h3>
          <p className="text-sm text-[#526384] max-w-md mx-auto">
            Prueba seleccionando otra categoría o cambiando la zona a "Toda Cochabamba".
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSelectedZone('Toda Cochabamba');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 rounded-full bg-[#FFE1C6] text-[#FF7A00] font-bold text-sm hover:bg-[#FF7A00] hover:text-white transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};
