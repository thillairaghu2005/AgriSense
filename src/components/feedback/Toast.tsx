import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext, useToast, type ToastType, type ToastItem } from './ToastContext';

export { useToast };
export type { ToastType, ToastItem };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, options?: { type?: ToastType; message?: string; durationMs?: number }) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const type = options?.type || 'success';
      const duration = options?.durationMs ?? 4000;

      const newToast: ToastItem = {
        id,
        title,
        message: options?.message,
        type,
      };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const contextValue = useMemo(() => ({
    showToast,
    dismissToast,
  }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[var(--color-text-primary)] flex-shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[var(--color-text-primary)] flex-shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[var(--color-text-primary)] flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-[var(--color-text-primary)] flex-shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-neutral-200 bg-white shadow-lg transition-all animate-slide-in"
            role="status"
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--color-text-primary)]">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
