import React, { useState } from 'react';
import { Company } from '../types';
import { Search, Store, Building2 } from 'lucide-react';

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
              className="clean-card p-6 cursor-pointer hover:border-[#FF7A00]/40 transition-all"
            >
              <h3 className="font-heading font-extrabold text-xl text-[#1E3A8A]">{comp.name}</h3>
              <p className="text-xs text-[#526384] mt-1">{comp.description}</p>
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
