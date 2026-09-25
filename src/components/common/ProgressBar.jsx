export default function ProgressBar({ value, label, showValue = true }) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-500">
          <span>{label ?? 'Progress'}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            pct === 100
              ? 'bg-emerald-500'
              : pct > 50
              ? 'bg-indigo-600'
              : pct > 0
              ? 'bg-amber-500'
              : 'bg-slate-300'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
