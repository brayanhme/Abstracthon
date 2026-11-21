import React, { useState, useMemo } from 'react';
import { CompostLot, Company } from '../types';
import { Sprout, Tractor, Leaf, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface CompostViewProps {
  compostLots: CompostLot[];
  companies: Company[];
  onRequestLot: (lot: CompostLot) => void;
  onViewCompany: (companyId: string) => void;
}

export const CompostView: React.FC<CompostViewProps> = ({
  compostLots,
  companies,
  onRequestLot,
  onViewCompany
}) => {
  const [filterType, setFilterType] = useState<string>('Todos los lotes');

  // Company logo lookup
  const companyMap = useMemo(() => {
    const map = new Map<string, Company>();
    companies.forEach(c => map.set(c.id, c));
    return map;
  }, [companies]);

  const filteredLots = useMemo(() => {
    if (filterType === 'Todos los lotes') return compostLots;
    return compostLots.filter(l => l.useType === filterType);
  }, [compostLots, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Banner didáctico sobre economía circular en Cochabamba */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#254ab3] text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#6B8F5E]/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8F5E]/30 text-emerald-200 border border-[#6B8F5E]/40 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Economía Circular & Cero Desperdicio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading leading-tight">
            Excedentes Orgánicos para Compostaje y Granjas del Valle
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            Conectamos los subproductos limpios de la industria y el comercio cochabambino con agricultores, lombricultores y productores pecuarios de Tiquipaya, Quillacollo y el Valle Alto.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#FFE1C6] font-heading block">+2,400 kg</span>
              <span className="text-xs text-gray-300">Biomasa recuperada / mes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#9EC5E8] font-heading block">35+ Granjas</span>
              <span className="text-xs text-gray-300">Beneficiarias en la Llajta</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#6B8F5E] font-heading block">-70% CO₂</span>
              <span className="text-xs text-gray-300">Menos metano en vertederos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#1E3A8A]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Tractor className="w-5 h-5 text-[#6B8F5E]" />
          <span className="text-sm font-bold text-[#1E3A8A]">Tipo de aprovechamiento:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['Todos los lotes', 'Compostaje / Humus', 'Alimento Animal'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                filterType === type
                  ? 'bg-[#6B8F5E] text-white shadow-sm'
                  : 'bg-[#FFFBF7] text-[#526384] border border-[#1E3A8A]/10 hover:border-[#6B8F5E]/40 hover:text-[#1E3A8A]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula de Lotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map(lot => {
          const company = companyMap.get(lot.companyId);
          const isOutOfStock = lot.stock <= 0;

          return (
            <div
              key={lot.id}
              className="clean-card p-6 flex flex-col justify-between border-t-4 border-t-[#6B8F5E] hover:border-t-[#58774d] space-y-4 group"
            >
              <div className="space-y-4">
                {/* Header de la tarjeta: logo empresa y badge tipo */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {company?.logoSvg && (
                      <div 
                        className="w-8 h-8 rounded-lg overflow-hidden border border-[#1E3A8A]/10 flex-shrink-0"
                        dangerouslySetInnerHTML={{ __html: company.logoSvg }}
                      />
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={() => onViewCompany(lot.companyId)}
                        className="text-xs font-bold text-[#1E3A8A] hover:text-[#FF7A00] transition-colors text-left truncate block"
                      >
                        {company?.name || lot.source}
                      </button>
                      <span className="text-[11px] text-[#526384]">{company?.zone}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isOutOfStock ? 'bg-gray-200 text-gray-500' : 'bg-[#6B8F5E]/15 text-[#6B8F5E]'
                  }`}>
                    {isOutOfStock ? 'Agotado' : `Stock: ${lot.stock} lotes`}
                  </span>
                </div>

                {/* Etiqueta de uso en #6B8F5E */}
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#6B8F5E] text-white">
                    <Leaf className="w-3 h-3" />
                    <span>{lot.useType}</span>
                  </span>
                </div>

                {/* Título y descripción */}
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-[#1E3A8A] group-hover:text-[#6B8F5E] transition-colors leading-snug">
                    {lot.title}
                  </h3>
                  <p className="text-xs text-[#526384] mt-2 leading-relaxed">
                    {lot.desc}
                  </p>
                </div>

                {/* Presentación aproximada */}
                <div className="bg-[#FFFBF7] p-3 rounded-xl border border-[#1E3A8A]/10 text-xs text-[#1E3A8A] flex items-center justify-between">
                  <span className="text-[#526384]">Presentación:</span>
                  <span className="font-bold">{lot.unit}</span>
                </div>
              </div>

              {/* Footer con precio y botón solicitar */}
              <div className="pt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-[#526384] block">Aporte logístico</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading font-extrabold text-2xl text-[#1E3A8A]">
                      Bs. {lot.price}
                    </span>
                    <span className="text-xs text-[#526384]">/ lote</span>
                  </div>
                </div>

                <button
                  disabled={isOutOfStock}
                  onClick={() => onRequestLot(lot)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#6B8F5E] hover:bg-[#58774d] text-white active:scale-95'
                  }`}
                >
                  <span>{isOutOfStock ? 'Agotado' : 'Solicitar lote'}</span>
                  {!isOutOfStock && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Caja de ayuda para agricultores */}
      <div className="clean-card p-6 bg-[#FFFFFF] border-l-4 border-l-[#9EC5E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-base text-[#1E3A8A]">
            ¿Tienes una granja o proyecto de compostaje a gran escala en Cochabamba?
          </h4>
          <p className="text-xs sm:text-sm text-[#526384]">
            Podemos organizar retiros periódicos programados y convenios de retiro de biomasa directamente con las plantas de producción.
          </p>
        </div>
        <a
          href="https://wa.me/59170000000?text=Hola%20Q'omer,%20tengo%20una%20granja%20en%20Cochabamba%20y%20deseo%20retirar%20biomasa"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#152a66] text-white text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm"
        >
          Convenio para Granjas
        </a>
      </div>

    </div>
  );
};
