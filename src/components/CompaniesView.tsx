import React, { useState } from 'react';
import { Company, OfferProduct, CompostLot } from '../types';
import { ArrowLeft, Search, MapPin, Phone, Clock, Store, Sprout, ArrowRight, Package } from 'lucide-react';

interface CompaniesViewProps {
  companies: Company[];
  offers: OfferProduct[];
  compostLots: CompostLot[];
  selectedCompanyId: string | null;
  onSelectCompany: (companyId: string | null) => void;
  onSelectProduct: (product: OfferProduct) => void;
  onReserveProduct: (product: OfferProduct) => void;
  onRequestCompost: (lot: CompostLot) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  offers,
  compostLots,
  selectedCompanyId,
  onSelectCompany,
  onSelectProduct,
  onReserveProduct,
  onRequestCompost
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Selected company for profile view
  const currentCompany = companies.find(c => c.id === selectedCompanyId);

  // Filtered companies for directory
  const filteredCompanies = companies.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // If a company profile is selected
  if (currentCompany) {
    const companyOffers = offers.filter(o => o.companyId === currentCompany.id);
    const companyCompost = compostLots.filter(c => c.companyId === currentCompany.id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        
        {/* Botón Volver */}
        <div>
          <button
            onClick={() => onSelectCompany(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#1E3A8A]/10 text-sm font-bold text-[#1E3A8A] hover:text-[#FF7A00] hover:border-[#FF7A00]/40 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a todas las empresas</span>
          </button>
        </div>

        {/* Tarjeta Cabecera de Empresa */}
        <div className="clean-card p-6 sm:p-8 bg-[#FFFFFF] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-[#1E3A8A]/10 flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: currentCompany.logoSvg }}
            />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFE1C6] text-[#FF7A00]">
                  {currentCompany.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#6B8F5E]/15 text-[#6B8F5E] flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Aliado de Economía Circular</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] font-heading">
                {currentCompany.name}
              </h1>
              <p className="text-sm sm:text-base text-[#526384] max-w-3xl">
                {currentCompany.description}
              </p>
            </div>
          </div>

          {/* Datos de contacto y horarios */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E3A8A]/10 text-sm">
            <div className="flex items-center gap-2 text-[#526384]">
              <MapPin className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
              <span>{currentCompany.address}</span>
            </div>
            {currentCompany.hours && (
              <div className="flex items-center gap-2 text-[#526384]">
                <Clock className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
                <span>Horario: {currentCompany.hours}</span>
              </div>
            )}
            {currentCompany.phone && (
              <div className="flex items-center gap-2 text-[#526384]">
                <Phone className="w-4 h-4 text-[#FF7A00] flex-shrink-0" />
                <span>Tel: {currentCompany.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bloque 1: Alimentos disponibles para rescate */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#FF7A00]" />
              <h2 className="text-2xl font-extrabold text-[#1E3A8A] font-heading">
                Productos disponibles para rescate
              </h2>
            </div>
            <span className="text-xs font-bold text-[#526384] bg-[#FFE1C6] px-3 py-1 rounded-full">
              {companyOffers.length} {companyOffers.length === 1 ? 'oferta' : 'ofertas'}
            </span>
          </div>

          {companyOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyOffers.map(item => {
                const discountPct = Math.round(((item.oldPrice - item.newPrice) / item.oldPrice) * 100);
                const isOutOfStock = item.stock <= 0;

                return (
                  <div
                    key={item.id}
                    className="clean-card overflow-hidden flex flex-col justify-between group cursor-pointer"
                    onClick={() => onSelectProduct(item)}
                  >
                    <div>
                      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isOutOfStock ? 'bg-[#B91C1C] text-white' : 'bg-white text-[#1E3A8A] shadow-md'
                          }`}>
                            {isOutOfStock ? 'Agotado' : `Stock: ${item.stock} disp.`}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#FF7A00] text-white">
                            -{discountPct}%
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-heading font-bold text-base text-[#1E3A8A] line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#526384] line-clamp-2">
                          {item.desc}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-[#526384]">
                          <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-[#1E3A8A]/5 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#526384] line-through block">Bs. {item.oldPrice}</span>
                        <span className="font-heading font-extrabold text-xl text-[#1E3A8A]">Bs. {item.newPrice}</span>
                      </div>
                      <button
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReserveProduct(item);
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-[#FF7A00] hover:bg-[#E06800] text-white shadow-sm transition-all"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="clean-card p-8 text-center text-[#526384] text-sm">
              Esta empresa no tiene ofertas de alimentos en este momento. Vuelve a revisar más tarde.
            </div>
          )}
        </div>

        {/* Bloque 2: Excedentes orgánicos para composta y granjas */}
        <div className="space-y-4 pt-6 border-t border-[#1E3A8A]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#6B8F5E]" />
              <div>
                <h2 className="text-2xl font-extrabold text-[#1E3A8A] font-heading">
                  Excedentes orgánicos para composta y granjas
                </h2>
                <p className="text-xs text-[#526384]">Lotes para compostadores, agricultores y granjas locales de Cochabamba.</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#6B8F5E] bg-[#6B8F5E]/15 px-3 py-1 rounded-full">
              {companyCompost.length} {companyCompost.length === 1 ? 'lote' : 'lotes'}
            </span>
          </div>

          {companyCompost.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyCompost.map(lot => {
                const isOutOfStock = lot.stock <= 0;
                return (
                  <div key={lot.id} className="clean-card p-5 flex flex-col justify-between border-l-4 border-l-[#6B8F5E] space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#6B8F5E]/20 text-[#6B8F5E]">
                          {lot.useType}
                        </span>
                        <span className="text-xs font-semibold text-[#526384]">
                          Stock: <strong className="text-[#1E3A8A]">{lot.stock} lotes</strong>
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#1E3A8A]">
                        {lot.title}
                      </h3>
                      <p className="text-xs text-[#526384] leading-relaxed">
                        {lot.desc}
                      </p>
                      <div className="text-xs font-semibold text-[#1E3A8A] bg-[#FFFBF7] p-2 rounded-lg border border-[#1E3A8A]/10">
                        Presentación: {lot.unit} ({lot.weightApprox})
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#1E3A8A]/10">
                      <div>
                        <span className="text-[11px] text-[#526384] block">Aporte simbólico</span>
                        <span className="font-heading font-extrabold text-xl text-[#1E3A8A]">
                          Bs. {lot.price}
                        </span>
                      </div>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => onRequestCompost(lot)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          isOutOfStock
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#6B8F5E] hover:bg-[#58774d] text-white shadow-sm'
                        }`}
                      >
                        {isOutOfStock ? 'Agotado' : 'Solicitar lote'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="clean-card p-8 text-center text-[#526384] text-sm">
              Esta empresa no tiene lotes de excedentes orgánicos activos actualmente.
            </div>
          )}
        </div>

      </div>
    );
  }

  // Vista Directorio Oficial
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Encabezado Directorio */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold uppercase tracking-wide">
          <Store className="w-3.5 h-3.5" />
          <span>Red de Aliados Cochabamba</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] font-heading">
          Empresas Comprometidas con el Rescate Alimentario
        </h1>
        <p className="text-base text-[#526384] max-w-2xl">
          Conoce a las marcas emblemáticas de Cochabamba que ponen sus excedentes diarios a disposición de la comunidad y agricultores locales.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Buscar empresa por nombre, rubro o zona..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#1E3A8A]/15 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1E3A8A] placeholder-[#526384]/60 outline-none focus:border-[#FF7A00] shadow-xs"
        />
        <Search className="w-4 h-4 text-[#526384] absolute left-3.5 top-3.5" />
      </div>

      {/* Cuadrícula de Empresas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(comp => {
          const companyOffersCount = offers.filter(o => o.companyId === comp.id).length;
          const companyCompostCount = compostLots.filter(c => c.companyId === comp.id).length;

          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompany(comp.id)}
              className="clean-card p-6 flex flex-col justify-between group cursor-pointer hover:border-[#FF7A00]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-[#1E3A8A]/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                    dangerouslySetInnerHTML={{ __html: comp.logoSvg }}
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF7A00] bg-[#FFE1C6] px-2 py-0.5 rounded-md">
                      {comp.category}
                    </span>
                    <h3 className="font-heading font-extrabold text-xl text-[#1E3A8A] mt-1 group-hover:text-[#FF7A00] transition-colors">
                      {comp.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#526384] line-clamp-3 leading-relaxed">
                  {comp.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-[#1E3A8A]/5 text-xs text-[#526384]">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                    <span className="truncate">{comp.address}</span>
                  </p>
                </div>
              </div>

              {/* Badges de disponibilidad y botón ver perfil */}
              <div className="pt-4 mt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#1E3A8A] bg-[#FFFBF7] px-2 py-1 rounded-md border border-[#1E3A8A]/10">
                    {companyOffersCount} ofertas
                  </span>
                  {companyCompostCount > 0 && (
                    <span className="font-bold text-[#6B8F5E] bg-[#6B8F5E]/15 px-2 py-1 rounded-md">
                      {companyCompostCount} composta
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-[#FF7A00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ver perfil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
