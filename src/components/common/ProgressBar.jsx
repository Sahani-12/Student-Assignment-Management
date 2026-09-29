export default function ProgressBar({
  value = 0,
  label,
  showValue = true,
  colorScheme = 'auto', // 'auto' | 'indigo' | 'emerald'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value || 0)));

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  const getColorClass = () => {
    if (colorScheme === 'emerald') return 'bg-emerald-500';
    if (colorScheme === 'indigo') return 'bg-indigo-600';
    if (pct === 100) return 'bg-emerald-500';
    if (pct > 50) return 'bg-indigo-600';
    if (pct > 0) return 'bg-amber-500';
    return 'bg-slate-300';
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-500">
          <span>{label ?? 'Progress'}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className={`${heightClass} w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColorClass()}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
