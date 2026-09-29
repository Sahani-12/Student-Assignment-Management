import { Menu, BookOpen, GraduationCap, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick, title }) {
  const { user, isProfessor } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md lg:px-8 shadow-xs">
      {/* Mobile Hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 shadow-xs lg:hidden"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2.5 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">
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

      {/* Right Controls: Semester Pill, Notification Bell, User Badge */}
      <div className="flex items-center gap-3.5">
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/80 text-slate-600 border border-slate-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Fall 2026 Term
        </span>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 shadow-xs"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        {/* Role Pill */}
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
          {isProfessor ? 'Professor' : 'Student'}
        </span>

        {/* Profile Avatar with Online Status Indicator */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-xs font-bold text-white shadow-sm ring-2 ring-indigo-100"
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
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400 capitalize">
              {user?.department || (isProfessor ? 'Faculty' : 'Student')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
