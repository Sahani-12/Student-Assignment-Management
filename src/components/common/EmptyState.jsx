import { FolderOpen, Plus } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/90 bg-white/60 p-10 sm:p-14 text-center backdrop-blur-xs transition hover:border-slate-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50/80 text-indigo-600 ring-8 ring-indigo-50/40">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-800 sm:text-lg">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      )}
      {action ? (
        <div className="mt-6">{action}</div>
      ) : actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          {actionLabel.includes('+') ? null : <Plus className="h-4 w-4" />}
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

