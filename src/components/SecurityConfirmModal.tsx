import React from 'react';
import { useGame } from '../context/GameContext';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export const SecurityConfirmModal: React.FC = () => {
  const { confirmationDialog, closeConfirmation } = useGame();

  if (!confirmationDialog || !confirmationDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md p-6 bg-white rounded-3xl shadow-2xl border-2 border-rose-200">
        <button
          onClick={closeConfirmation}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          aria-label="Batal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider text-rose-600 uppercase block">
              Konfirmasi Keamanan Sistem
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 leading-tight">
              {confirmationDialog.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          {confirmationDialog.message}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={closeConfirmation}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={confirmationDialog.onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all ${
              confirmationDialog.isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'
            }`}
          >
            {confirmationDialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
