import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RotateCcw,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAssignments } from '../../context/AssignmentsContext';
import { resetDemoData } from '../../utils/storage';
import ConfirmationModal from '../common/Modal';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
    isActive
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { refresh } = useAssignments();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const handleNav = () => onNavigate?.();

  const handleResetDemo = () => {
    resetDemoData();
    refresh();
    setResetOpen(false);
    showToast('Demo data restored successfully');
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex h-full flex-col border-r border-slate-200/80 bg-white/90 px-4 py-6 backdrop-blur-md">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">AssignmentHub</p>
          <p className="text-xs font-medium text-slate-500 capitalize">{user?.role ?? 'User'} Portal</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main Navigation">
        {isAdmin ? (
          <>
            <NavLink to="/admin/dashboard" className={linkClass} onClick={handleNav}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/assignments" className={linkClass} onClick={handleNav} end>
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Assignments
            </NavLink>
            <NavLink
              to="/admin/assignments/create"
              className={linkClass}
              onClick={handleNav}
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create Assignment
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/student/dashboard" className={linkClass} onClick={handleNav}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900">{user?.name}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset Demo Data
        </button>

        <button
          type="button"
          onClick={() => {
            logout();
            handleNav();
            navigate('/login');
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>

      <ConfirmationModal
        open={resetOpen}
        title="Reset Demo Data?"
        confirmLabel="Reset Data"
        variant="danger"
        onCancel={() => setResetOpen(false)}
        onConfirm={handleResetDemo}
      >
        This will reset all assignments and submission data to the initial seed state.
        You will be redirected to the login page.
      </ConfirmationModal>
    </aside>
  );
}
