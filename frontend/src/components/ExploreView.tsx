import React, { useState } from 'react';
import { OfferProduct } from '../types';
import { MapPin, Sparkles, Filter, PackageOpen } from 'lucide-react';

interface ExploreViewProps {
  offers?: OfferProduct[];
  categories?: string[];
  zones?: string[];
  onSelectProduct?: (product: OfferProduct) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  offers = [],
  categories = ['Todas las categorías'],
  zones = ['Todas las zonas'],
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || 'Todas las categorías');
  const [selectedZone, setSelectedZone] = useState<string>(zones[0] || 'Todas las zonas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOffers = offers.filter(item => {
    const matchCategory = selectedCategory === 'Todas las categorías' || item.category === selectedCategory;
    const matchZone = selectedZone === 'Todas las zonas' || item.zone === selectedZone;
    const matchSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bizName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchZone && matchSearch;
  });

  return (
    <section id="explorar" className="scroll-mt-24 space-y-8">
      <div className="text-center md:text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rescate Alimentario</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] font-heading tracking-tight">
          Alimentos frescos de Cochabamba, a mitad de precio.
        </h1>
        <p className="text-base sm:text-lg text-[#526384] max-w-2xl">
          Evitamos el desperdicio conectándote con panaderías, supermercados y empresas locales en la Llajta.
        </p>
      </div>

      <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#1E3A8A]/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF7A00] flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#526384]">Zona:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#FFFBF7] border border-[#1E3A8A]/15 text-[#1E3A8A] text-sm font-semibold rounded-xl px-3 py-2 outline-none focus:border-[#FF7A00] cursor-pointer"
            >
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar alimentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFBF7] border border-[#1E3A8A]/15 rounded-xl pl-9 pr-4 py-2 text-sm text-[#1E3A8A] placeholder-[#526384]/60 outline-none focus:border-[#FF7A00]"
            />
            <Filter className="w-4 h-4 text-[#526384] absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(category => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      {filteredOffers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((item) => (
            <div
              key={item.id}
              className="clean-card rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer"
              onClick={() => onSelectProduct && onSelectProduct(item)}
            >
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                  src={item.imageUrl || item.image || 'https://placehold.co/600x400/FFE1C6/1E3A8A?text=ReAprovecha'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-extrabold text-white bg-[#FF7A00] shadow-xs">
                  -{Math.round((((item.oldPrice || item.originalPrice || 1) - (item.newPrice || item.discountPrice || 0)) / (item.oldPrice || item.originalPrice || 1)) * 100)}%
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-xs backdrop-blur-md bg-white/95 text-[#1E3A8A] border border-[#1E3A8A]/10">
                  Stock: {item.stock} disp.
                </span>
              </div>

              <div className="p-6 pb-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#1E3A8A]">{item.bizName}</span>
                  <span className="text-[#526384] truncate">{item.zone}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1E3A8A] leading-snug pt-0.5">{item.title}</h3>
                <p className="text-xs text-[#526384]">Retiro: {item.pickupWindow || item.pickupTime || 'Hoy'}</p>
              </div>

              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-[#1E3A8A]/10">
                <div>
                  <span className="text-xs line-through text-[#526384] block">Bs. {item.oldPrice || item.originalPrice || 0}</span>
                  <span className="font-heading text-2xl font-extrabold text-[#1E3A8A]">Bs. {item.newPrice || item.discountPrice || 0}</span>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-[#FF7A00] hover:bg-[#E06800] transition cursor-pointer shadow-xs"
                >
                  Reservar &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 text-center text-[#526384] space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FFE1C6]/60 text-[#FF7A00] flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <p className="font-heading font-bold text-lg text-[#1E3A8A]">
            No hay productos disponibles por el momento
          </p>
          <p className="text-xs text-[#526384] max-w-sm mx-auto">
            Los productos cargados aparecerán en esta cuadrícula cuando estén disponibles.
          </p>
        </div>
      )}
    </section>
  );
};
