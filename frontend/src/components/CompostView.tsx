import React, { useState } from 'react';
import { CompostLot } from '../types';
import { Sprout, Tractor, Shovel } from 'lucide-react';

interface CompostViewProps {
  compostLots?: CompostLot[];
  onRequestLot?: (lot: CompostLot) => void;
}

export const CompostView: React.FC<CompostViewProps> = ({
  compostLots = [],
  onRequestLot
}) => {
  const [filterType, setFilterType] = useState<string>('Todos los lotes');

  const filteredLots = filterType === 'Todos los lotes'
    ? compostLots
    : compostLots.filter(l => l.useType === filterType);

  return (
    <section id="composta" className="scroll-mt-24 space-y-8 pt-8 border-t border-[#1E3A8A]/10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#254ab3] text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8F5E]/30 text-emerald-200 border border-[#6B8F5E]/40 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Economía Circular</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading leading-tight">
            Excedentes Orgánicos para Compostaje y Granjas del Valle
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            Canalizamos los subproductos limpios de comercios de Cochabamba hacia agricultores, lombricultores y productores pecuarios de Tiquipaya, Quillacollo y el Valle Alto.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#FFE1C6] font-heading block">+2,400 kg</span>
              <span className="text-xs text-gray-300">Biomasa / mes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#9EC5E8] font-heading block">35+ Granjas</span>
              <span className="text-xs text-gray-300">En Cochabamba</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15">
              <span className="text-xl sm:text-2xl font-extrabold text-[#6B8F5E] font-heading block">-70% CO₂</span>
              <span className="text-xs text-gray-300">Menos emisiones</span>
            </div>
          </div>
        </div>
      </div>

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
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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

      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map(lot => (
            <div
              key={lot.id}
              className="clean-card rounded-3xl p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#1E3A8A]">{lot.companyName || 'Empresa Aliada'}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFFBF7] text-[#1E3A8A] border border-[#1E3A8A]/10">
                    Stock: {lot.stock || 1} lotes
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#6B8F5E]/20 text-[#6B8F5E]">
                  <Sprout className="w-3 h-3" />
                  <span>{lot.useType}</span>
                </span>
                <h3 className="font-heading font-extrabold text-lg text-[#1E3A8A] leading-snug">{lot.title}</h3>
                <p className="text-xs text-[#526384]">{lot.description}</p>
                <div className="p-2.5 rounded-xl bg-[#FFFBF7] border border-[#1E3A8A]/10 text-xs flex items-center justify-between">
                  <span className="text-[#526384]">Presentación:</span>
                  <span className="font-semibold text-[#1E3A8A]">{lot.weightKg ? `${lot.weightKg} kg` : 'Bolsa / Bidón'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#526384] block">Aporte simbólico</span>
                  <span className="font-heading text-2xl font-extrabold text-[#1E3A8A]">Bs. {lot.symbolicPrice || 0}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRequestLot && onRequestLot(lot)}
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-[#6B8F5E] hover:bg-[#5a7b4f] transition cursor-pointer shadow-xs"
                >
                  Solicitar lote &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clean-card p-12 text-center text-[#526384] space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#6B8F5E]/15 text-[#6B8F5E] flex items-center justify-center mx-auto">
            <Shovel className="w-7 h-7" />
          </div>
          <p className="font-heading font-bold text-lg text-[#1E3A8A]">
            No hay lotes de composta registrados por el momento
          </p>
          <p className="text-xs text-[#526384] max-w-sm mx-auto">
            Los excedentes de biomasa orgánica para compostaje y alimento animal se mostrarán aquí.
          </p>
        </div>
      )}
    </section>
  );
};
