import React, { useState } from 'react';
import { Company, OfferProduct, CompostLot } from '../types';
import { ArrowLeft, Search, MapPin, Phone, Clock, Store, Sprout, ArrowRight, Package, Database } from 'lucide-react';

interface CompaniesViewProps {
  companies: Company[];
  offers?: OfferProduct[];
  compostLots?: CompostLot[];
  selectedCompanyId: string | null;
  onSelectCompany: (companyId: string | null) => void;
  onSelectProduct?: (product: OfferProduct) => void;
  onReserveProduct?: (product: OfferProduct) => void;
  onRequestCompost?: (lot: CompostLot) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  offers = [],
  compostLots = [],
  selectedCompanyId,
  onSelectCompany,
  onSelectProduct,
  onReserveProduct,
  onRequestCompost
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const currentCompany = companies.find(c => c.id === selectedCompanyId);

  const filteredCompanies = companies.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Vista Individual: Perfil de Empresa
  if (currentCompany) {
    const companyOffers = offers.filter(o => o.companyId === currentCompany.id);
    const companyCompost = compostLots.filter(c => c.companyId === currentCompany.id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
        
        {/* Botón Volver */}
        <div>
          <button
            onClick={() => onSelectCompany(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#1E3A8A]/10 text-sm font-bold text-[#1E3A8A] hover:text-[#FF7A00] hover:border-[#FF7A00]/40 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al directorio de empresas</span>
          </button>
        </div>

        {/* Tarjeta Cabecera de Empresa */}
        <div className="clean-card p-6 sm:p-8 bg-[#FFFFFF] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {currentCompany.logoSvg ? (
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md border border-[#1E3A8A]/10 flex-shrink-0"
                dangerouslySetInnerHTML={{ __html: currentCompany.logoSvg }}
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#FFE1C6] text-[#FF7A00] flex items-center justify-center font-bold text-2xl">
                {currentCompany.name.charAt(0)}
              </div>
            )}
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
              {companyOffers.map(item => (
                <div
                  key={item.id}
                  className="clean-card p-5 flex flex-col justify-between group cursor-pointer"
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                >
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-base text-[#1E3A8A]">{item.title}</h3>
                    <p className="text-xs text-[#526384] line-clamp-2">{item.description}</p>
                    <p className="text-xs text-[#526384] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>{item.pickupWindow}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-[#1E3A8A]/10 mt-3">
                    <span className="font-heading font-extrabold text-xl text-[#1E3A8A]">Bs. {item.newPrice}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onReserveProduct) onReserveProduct(item);
                      }}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#FF7A00] text-white hover:bg-[#E06800] transition-colors"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="clean-card p-8 text-center text-[#526384] text-sm">
              No hay ofertas activas registradas para esta empresa en la base de datos.
            </div>
          )}
        </div>

        {/* Bloque 2: Excedentes orgánicos para composta */}
        <div className="space-y-4 pt-6 border-t border-[#1E3A8A]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#6B8F5E]" />
              <h2 className="text-2xl font-extrabold text-[#1E3A8A] font-heading">
                Excedentes orgánicos para composta y granjas
              </h2>
            </div>
            <span className="text-xs font-bold text-[#6B8F5E] bg-[#6B8F5E]/15 px-3 py-1 rounded-full">
              {companyCompost.length} lotes
            </span>
          </div>

          {companyCompost.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyCompost.map(lot => (
                <div key={lot.id} className="clean-card p-5 border-l-4 border-l-[#6B8F5E] flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-[#6B8F5E] bg-[#6B8F5E]/20 px-2 py-0.5 rounded-full">
                      {lot.useType}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-[#1E3A8A] mt-2">{lot.title}</h3>
                    <p className="text-xs text-[#526384]">{lot.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#1E3A8A]/10">
                    <span className="font-heading font-extrabold text-xl text-[#1E3A8A]">Bs. {lot.price}</span>
                    <button
                      onClick={() => onRequestCompost && onRequestCompost(lot)}
                      className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#6B8F5E] text-white hover:bg-[#58774d] transition-colors"
                    >
                      Solicitar lote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="clean-card p-8 text-center text-[#526384] text-sm">
              Sin lotes de biomasa registrados en la base de datos para esta empresa.
            </div>
          )}
        </div>

      </div>
    );
  }

  // Vista Directorio
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Encabezado */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold uppercase tracking-wide">
          <Store className="w-3.5 h-3.5" />
          <span>Red de Aliados Cochabamba</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] font-heading">
          Empresas Comprometidas con el Rescate Alimentario
        </h1>
        <p className="text-base text-[#526384] max-w-2xl">
          Visualiza las marcas aliadas registradas en la base de datos de Cochabamba.
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

      {/* Cuadrícula o estado de espera */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(comp => (
            <div
              key={comp.id}
              onClick={() => onSelectCompany(comp.id)}
              className="clean-card p-6 flex flex-col justify-between group cursor-pointer hover:border-[#FF7A00]/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {comp.logoSvg ? (
                    <div 
                      className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-[#1E3A8A]/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                      dangerouslySetInnerHTML={{ __html: comp.logoSvg }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#FFE1C6] text-[#FF7A00] flex items-center justify-center font-bold text-xl">
                      {comp.name.charAt(0)}
                    </div>
                  )}
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

                <p className="flex items-center gap-1.5 text-xs text-[#526384] pt-2 border-t border-[#1E3A8A]/5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span className="truncate">{comp.address}</span>
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E3A8A]">
                  Ver productos y biomasa
                </span>
                <span className="text-xs font-bold text-[#FF7A00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <Database className="w-12 h-12 text-[#FF7A00] mx-auto" />
          <h3 className="text-lg font-bold text-[#1E3A8A] font-heading">
            En espera de empresas registradas en la Base de Datos
          </h3>
          <p className="text-xs sm:text-sm text-[#526384]">
            El endpoint <code className="bg-[#FFFBF7] px-2 py-0.5 rounded font-mono font-bold text-[#1E3A8A]">GET /api/companies</code> suministrará las empresas asociadas.
          </p>
        </div>
      )}

    </div>
  );
};
