import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs font-medium text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-semibold text-slate-600"
                >
                  {idx === 0 && item.showHomeIcon && <Home className="h-3.5 w-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span className={`truncate max-w-[200px] sm:max-w-xs ${isLast ? 'text-slate-900 font-bold' : ''}`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
