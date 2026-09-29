import { TrendingUp } from 'lucide-react';

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'indigo',
  subtitle,
}) {
  const accents = {
    indigo: {
      iconBg: 'bg-indigo-50/90 text-indigo-600 border border-indigo-100/80 shadow-xs shadow-indigo-500/10',
      glow: 'group-hover:border-indigo-200',
    },
    emerald: {
      iconBg: 'bg-emerald-50/90 text-emerald-600 border border-emerald-100/80 shadow-xs shadow-emerald-500/10',
      glow: 'group-hover:border-emerald-200',
    },
    amber: {
      iconBg: 'bg-amber-50/90 text-amber-600 border border-amber-100/80 shadow-xs shadow-amber-500/10',
      glow: 'group-hover:border-amber-200',
    },
    slate: {
      iconBg: 'bg-slate-100/90 text-slate-600 border border-slate-200 shadow-xs',
      glow: 'group-hover:border-slate-300',
    },
  };

  const currentAccent = accents[accent] || accents.indigo;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/85 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${currentAccent.glow}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            {label}
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
          {subtitle ? (
            <p className="text-[11px] font-medium text-slate-400 pt-0.5">
              {subtitle}
            </p>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active this semester</span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-110 ${currentAccent.iconBg}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  );
}
