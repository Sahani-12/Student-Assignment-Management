export default function StatCard({ label, value, icon: Icon, accent = 'indigo' }) {
  const accents = {
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    slate: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accents[accent] || accents.indigo}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
    </article>
  );
}
