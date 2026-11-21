import React from 'react';
import { OfferProduct } from '../types';
import { X, Clock, MapPin, ShieldCheck, ArrowRight, Store } from 'lucide-react';

interface ProductDrawerProps {
  product: OfferProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onReserve?: (product: OfferProduct) => void;
  onViewCompany?: (companyId: string) => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  product,
  isOpen,
  onClose,
  onReserve,
  onViewCompany
}) => {
  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const discountPct = product.oldPrice > product.newPrice
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 50;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#FFFFFF] shadow-2xl flex flex-col justify-between animate-slideLeft">
          
          {/* Header con botón cerrar */}
          <div className="relative">
            <div className="h-64 sm:h-72 w-full overflow-hidden bg-gray-100 relative">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#FFE1C6]/40 flex items-center justify-center">
                  <Store className="w-16 h-16 text-[#FF7A00]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
              
              {/* Botón cerrar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#1E3A8A] flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                title="Cerrar panel"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Badges superiores */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF7A00] shadow-md">
                  -{discountPct}% Descuento
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isOutOfStock ? 'bg-[#B91C1C]' : 'bg-[#1E3A8A]'
                }`}>
                  {isOutOfStock ? 'Agotado' : `Stock: ${product.stock} disponibles`}
                </span>
              </div>
            </div>
          </div>

          {/* Cuerpo del drawer con scroll */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            
            {/* Empresa y link al perfil */}
            <div className="flex items-center justify-between p-3.5 bg-[#FFFBF7] rounded-xl border border-[#1E3A8A]/10">
              <div>
                <h4 className="text-sm font-bold text-[#1E3A8A]">
                  {product.bizName}
                </h4>
                <p className="text-xs text-[#526384]">
                  Empresa registrada en base de datos
                </p>
              </div>

              {onViewCompany && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewCompany(product.companyId);
                  }}
                  className="text-xs font-bold text-[#FF7A00] hover:text-[#E06800] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Ver perfil</span>
                </button>
              )}
            </div>

            {/* Título y categoría */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A00] bg-[#FFE1C6] px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <h2 className="text-2xl font-heading font-extrabold text-[#1E3A8A] mt-2 leading-tight">
                {product.title}
              </h2>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#526384]">
                Detalles del paquete
              </h4>
              <p className="text-sm text-[#526384] leading-relaxed">
                {product.description || 'Sin descripción adicional en la base de datos.'}
              </p>
            </div>

            {/* Horario y Punto de retiro */}
            <div className="space-y-3 pt-2 border-t border-[#1E3A8A]/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFE1C6] text-[#FF7A00] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-[#526384] font-medium">Horario de retiro</p>
                  <p className="text-sm font-bold text-[#1E3A8A]">{product.pickupWindow}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFE1C6] text-[#1E3A8A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-[#526384] font-medium">Ubicación</p>
                  <p className="text-sm font-bold text-[#1E3A8A]">{product.zone}, Cochabamba</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B8F5E]/15 text-[#6B8F5E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-[#526384] font-medium">Garantía Q'omer</p>
                  <p className="text-xs text-[#526384] leading-relaxed">
                    Alimentos garantizados por la empresa emisora para retiro el mismo día.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer con precio y acción */}
          <div className="p-6 bg-[#FFFBF7] border-t border-[#1E3A8A]/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#526384] line-through block">
                Bs. {product.oldPrice}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#FF7A00]">Rescate:</span>
                <span className="font-heading font-extrabold text-3xl text-[#1E3A8A]">
                  Bs. {product.newPrice}
                </span>
              </div>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={() => {
                if (onReserve) onReserve(product);
                onClose();
              }}
              className={`px-7 py-3 rounded-full text-base font-bold flex items-center gap-2 shadow-lg transition-all ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FF7A00] hover:bg-[#E06800] text-white active:scale-95 shadow-[#FF7A00]/30 cursor-pointer'
              }`}
            >
              <span>{isOutOfStock ? 'Sin stock' : 'Reservar ahora'}</span>
              {!isOutOfStock && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
