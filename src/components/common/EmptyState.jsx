export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center shadow-xs">
      <p className="text-lg font-bold text-slate-800">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
