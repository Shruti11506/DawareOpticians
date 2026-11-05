import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-soft-lg border text-xs font-semibold ${
        toast.type === 'danger'
          ? 'bg-rose-900 text-white border-rose-800'
          : toast.type === 'warning'
          ? 'bg-amber-900 text-white border-amber-800'
          : 'bg-navy-950 text-white border-gold-500/40 shadow-navy'
      }`}>
        {toast.type === 'danger' ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
        ) : toast.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
        )}
        <span className="pr-2">{toast.message}</span>
      </div>
    </div>
  );
};

