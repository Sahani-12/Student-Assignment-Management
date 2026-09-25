import { Menu, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick, title }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
            A
          </div>
          <span className="text-base font-bold text-slate-900">AssignmentHub</span>
        </div>
      </div>
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 ring-2 ring-indigo-200"
        aria-hidden="true"
      >
        {user?.name?.charAt(0) ?? '?'}
      </div>
    </header>
  );
}
