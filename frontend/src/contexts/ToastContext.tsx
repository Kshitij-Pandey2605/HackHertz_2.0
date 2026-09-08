import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastType; title?: string; message: string }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title, message }: { type?: ToastType; title?: string; message: string }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: Toast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => addToast({ type: 'success', title, message }),
    [addToast]
  );
  const error = useCallback(
    (message: string, title?: string) => addToast({ type: 'error', title, message }),
    [addToast]
  );
  const info = useCallback(
    (message: string, title?: string) => addToast({ type: 'info', title, message }),
    [addToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => addToast({ type: 'warning', title, message }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-brand-600 flex-shrink-0" />,
          };

          const borders = {
            success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
            error: 'border-rose-200 bg-rose-50/90 text-rose-950',
            warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
            info: 'border-brand-200 bg-brand-50/90 text-brand-950',
          };

          return (
            <div
              key={t.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-elevated transition-all transform duration-200 backdrop-blur-sm ${borders[t.type]}`}
            >
              {icons[t.type]}
              <div className="flex-1 text-sm">
                {t.title && <p className="font-semibold">{t.title}</p>}
                <p className="opacity-90">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-60 hover:opacity-100 transition-opacity p-0.5"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
