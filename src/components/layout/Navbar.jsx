import { Menu, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick, title }) {
  const { user, isProfessor } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md lg:px-8">
      {/* Mobile Hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-xs">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            AssignmentHub
          </span>
        </div>
        {title && (
          <h2 className="hidden text-base font-bold text-slate-800 lg:block">
            {title}
          </h2>
        )}
      </div>

      {/* Right User Badge & Profile */}
      <div className="flex items-center gap-3">
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isProfessor
              ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20'
              : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20'
          }`}
        >
          {isProfessor ? (
            <ShieldCheck className="h-3.5 w-3.5" />
          ) : (
            <GraduationCap className="h-3.5 w-3.5" />
          )}
          {isProfessor ? 'Professor Portal' : 'Student Portal'}
        </span>

        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-bold text-white shadow-xs"
            aria-hidden="true"
          >
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2)
              : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-500 capitalize">
              {isProfessor ? 'Faculty' : 'Student'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
