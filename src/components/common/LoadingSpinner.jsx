export default function LoadingSpinner({ label = 'Loading assignments...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20" role="status">
      <div
        className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-200 border-t-indigo-600"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
