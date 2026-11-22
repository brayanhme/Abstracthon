import React, { useState } from 'react';
import { Company } from '../types';
import { Search, Store, Building2, MapPin, ArrowRight } from 'lucide-react';

interface CompaniesViewProps {
  companies?: Company[];
  onSelectCompany?: (companyId: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies = [],
  onSelectCompany
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section id="empresas" className="scroll-mt-24 space-y-8 pt-8 border-t border-[#1E3A8A]/10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE1C6] text-[#FF7A00] text-xs font-bold uppercase tracking-wide">
          <Store className="w-3.5 h-3.5" />
          <span>Red de Aliados</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] font-heading">
          Empresas Aliadas en Cochabamba
        </h1>
        <p className="text-base text-[#526384] max-w-2xl">
          Directorio oficial de comercios, supermercados y panaderías asociadas a ReAprovecha.
        </p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Buscar empresas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#FFFFFF] border border-[#1E3A8A]/15 rounded-xl pl-10 pr-4 py-3 text-sm text-[#1E3A8A] placeholder-[#526384]/60 outline-none focus:border-[#FF7A00] shadow-xs"
        />
        <Search className="w-4 h-4 text-[#526384] absolute left-3.5 top-3.5" />
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(comp => (
            <div
              key={comp.id}
              onClick={() => onSelectCompany && onSelectCompany(comp.id)}
              className="clean-card rounded-3xl p-6 cursor-pointer flex flex-col justify-between space-y-5 hover:border-[#FF7A00]/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FFE1C6] text-[#1E3A8A] flex items-center justify-center font-heading font-extrabold text-2xl shrink-0 shadow-xs">
                  {comp.name.charAt(0)}
                </div>
                <div className="min-w-0 space-y-1">
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FFE1C6] text-[#1E3A8A]">
                    {comp.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-[#1E3A8A] truncate">{comp.name}</h3>
                  <p className="text-xs text-[#526384] flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                    <span>{comp.address || comp.zone}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#526384] line-clamp-2">{comp.description}</p>

              <div className="pt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#1E3A8A]">{comp.activeOffersCount || 0} ofertas activas</span>
                <span className="font-semibold text-[#FF7A00] flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>Ver productos y biomasa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 text-center text-[#526384] space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FFE1C6]/60 text-[#FF7A00] flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <p className="font-heading font-bold text-lg text-[#1E3A8A]">
            No hay empresas registradas por el momento
          </p>
          <p className="text-xs text-[#526384] max-w-sm mx-auto">
            Las empresas asociadas y sus perfiles se desplegarán en esta sección.
          </p>
        </div>
      )}
    </section>
  );
};
