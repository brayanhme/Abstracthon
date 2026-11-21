import React, { useState } from 'react';
import { CompostLot } from '../types';
import { Sprout, Tractor, Leaf, Database, ArrowRight } from 'lucide-react';

interface CompostViewProps {
  compostLots: CompostLot[];
  onRequestLot?: (lot: CompostLot) => void;
}

export const CompostView: React.FC<CompostViewProps> = ({
  compostLots,
  onRequestLot
}) => {
  const [filterType, setFilterType] = useState<string>('Todos los lotes');

  const filteredLots = filterType === 'Todos los lotes'
    ? compostLots
    : compostLots.filter(l => l.useType === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Banner didáctico sobre economía circular en Cochabamba */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#254ab3] text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8F5E]/30 text-emerald-200 border border-[#6B8F5E]/40 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Economía Circular & Cero Desperdicio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading leading-tight">
            Excedentes Orgánicos para Compostaje y Granjas del Valle
          </h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            Canalizamos los subproductos limpios de la industria y comercios de Cochabamba hacia agricultores, lombricultores y productores de Tiquipaya, Quillacollo y el Valle Alto.
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

      {/* Cuadrícula de lotes o mensaje de base de datos */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map(lot => {
            const isOutOfStock = lot.stock <= 0;

            return (
              <div
                key={lot.id}
                className="clean-card p-6 flex flex-col justify-between border-t-4 border-t-[#6B8F5E] hover:border-t-[#58774d] space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-bold text-[#1E3A8A]">
                      {lot.source}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isOutOfStock ? 'bg-gray-200 text-gray-500' : 'bg-[#6B8F5E]/15 text-[#6B8F5E]'
                    }`}>
                      {isOutOfStock ? 'Agotado' : `Stock: ${lot.stock} lotes`}
                    </span>
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#6B8F5E] text-white">
                      <Leaf className="w-3 h-3" />
                      <span>{lot.useType}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-[#1E3A8A]">
                      {lot.title}
                    </h3>
                    <p className="text-xs text-[#526384] mt-2 leading-relaxed">
                      {lot.description}
                    </p>
                  </div>

                  <div className="bg-[#FFFBF7] p-3 rounded-xl border border-[#1E3A8A]/10 text-xs text-[#1E3A8A] flex items-center justify-between">
                    <span className="text-[#526384]">Presentación:</span>
                    <span className="font-bold">{lot.unit} {lot.weightApprox ? `(${lot.weightApprox})` : ''}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E3A8A]/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-[#526384] block">Aporte simbólico</span>
                    <span className="font-heading font-extrabold text-2xl text-[#1E3A8A]">
                      Bs. {lot.price}
                    </span>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => onRequestLot && onRequestLot(lot)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#6B8F5E] hover:bg-[#58774d] text-white active:scale-95 cursor-pointer'
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
      ) : (
        <div className="clean-card p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2">
          <Database className="w-12 h-12 text-[#6B8F5E] mx-auto" />
          <h3 className="text-lg font-bold text-[#1E3A8A] font-heading">
            En espera de lotes orgánicos desde la Base de Datos
          </h3>
          <p className="text-xs sm:text-sm text-[#526384]">
            Conexión lista para endpoint <code className="bg-[#FFFBF7] px-2 py-0.5 rounded font-mono font-bold text-[#1E3A8A]">GET /api/compost-lots</code>.
          </p>
        </div>
      )}

    </div>
  );
};
