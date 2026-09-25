import { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  const isError = type === 'error';

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3.5 shadow-2xl backdrop-blur-md transition-all sm:left-auto sm:right-6 sm:translate-x-0"
      role="status"
      aria-live="polite"
    >
      {isError ? (
        <XCircle className="h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
      )}
      <p className="text-sm font-semibold text-slate-800">{message}</p>
    </div>
  );
}
