import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search assignments...' }) {
  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">Search</span>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}
