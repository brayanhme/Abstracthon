import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#FFFFFF] rounded-2xl p-4 shadow-xl border border-[#1E3A8A]/10 flex items-start gap-3 animate-slideUp transition-all"
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#6B8F5E]" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-[#FF7A00]" />}
              {!isSuccess && !isWarning && <Info className="w-5 h-5 text-[#1E3A8A]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-bold text-sm text-[#1E3A8A]">
                {toast.title}
              </h5>
              <p className="text-xs text-[#526384] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#526384] hover:text-[#1E3A8A] p-1 rounded-md transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
