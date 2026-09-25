import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export default function ConfirmationModal({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) {
  const titleId = useId();
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 shadow-sm'
      : 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500 shadow-sm';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        aria-label="Close dialog backdrop"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm leading-relaxed text-slate-600">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
