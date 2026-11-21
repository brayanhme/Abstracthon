import React, { useState } from 'react';
import { X, User, Mail, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe tu nombre o apodo.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setError('Por favor indica tu correo electrónico o número de celular.');
      return;
    }

    onLogin({
      name: name.trim(),
      emailOrPhone: emailOrPhone.trim(),
      isLoggedIn: true
    });
    setName('');
    setEmailOrPhone('');
    setError('');
    onClose();
  };

  const handleQuickLogin = (quickName: string, quickContact: string) => {
    onLogin({
      name: quickName,
      emailOrPhone: quickContact,
      isLoggedIn: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#1E3A8A]/10 animate-scaleIn">
          
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFFBF7] text-[#526384] hover:text-[#1E3A8A] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Encabezado del modal */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE1C6] text-[#FF7A00] flex items-center justify-center mx-auto shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-[#1E3A8A]">
              Bienvenido a Q'omer
            </h3>
            <p className="text-xs sm:text-sm text-[#526384]">
              Inicia sesión para sincronizar tus reservas y puntos de retiro en Cochabamba.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-1.5">
                Nombre o apodo
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ej. Rodrigo Vargas"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-[#FFFBF7] border border-[#1E3A8A]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1E3A8A] placeholder-[#526384]/50 outline-none focus:border-[#FF7A00]"
                />
                <User className="w-4 h-4 text-[#526384] absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E3A8A] mb-1.5">
                Correo electrónico o celular
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="rodrigo@valle.bo o 70712345"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full bg-[#FFFBF7] border border-[#1E3A8A]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1E3A8A] placeholder-[#526384]/50 outline-none focus:border-[#FF7A00]"
                />
                <Mail className="w-4 h-4 text-[#526384] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1E3A8A] hover:bg-[#152a66] text-white font-bold text-sm shadow-md transition-all active:scale-98 mt-2"
            >
              Acceder a mi cuenta
            </button>
          </form>

          {/* Accesos rápidos de prueba para demo */}
          <div className="mt-6 pt-5 border-t border-[#1E3A8A]/10 text-center space-y-2">
            <span className="text-[11px] font-semibold text-[#526384] block">
              Accesos rápidos sugeridos (Modo Demo):
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('Valeria Torrico', 'valeria.cbba@gmail.com')}
                className="px-3 py-1.5 rounded-lg bg-[#FFE1C6]/60 hover:bg-[#FFE1C6] text-xs font-bold text-[#1E3A8A] transition-colors"
              >
                Compradora Rescate
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('Granja Don Mario', 'granja.tiquipaya@gmail.com')}
                className="px-3 py-1.5 rounded-lg bg-[#6B8F5E]/15 hover:bg-[#6B8F5E]/25 text-xs font-bold text-[#6B8F5E] transition-colors"
              >
                Agricultor / Composta
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
