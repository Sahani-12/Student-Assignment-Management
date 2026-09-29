import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  FolderOpen,
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
  const { user, logout, isProfessor } = useAuth();
  const { showToast } = useToast();
  const { refresh, courses } = useAssignments();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);

  const handleNav = () => onNavigate?.();

  const handleResetDemo = () => {
    resetDemoData();
    refresh();
    setResetOpen(false);
    showToast('Demo data restored successfully');
    logout();
    navigate('/login');
  };

  // Filter courses for quick shortcuts
  const userCourses = isProfessor
    ? courses.filter((c) => c.professorId === user?.id || user?.id === 'admin-1')
    : courses.filter((c) => c.studentIds?.includes(user?.id));

  return (
    <aside className="flex h-full flex-col border-r border-slate-200/80 bg-white px-4 py-6">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900 leading-tight">
            AssignmentHub
          </p>
          <p className="text-xs font-medium text-slate-500 capitalize">
            {isProfessor ? 'Professor SaaS' : 'Student Portal'}
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
          Menu
        </p>
        {isProfessor ? (
          <>
            <NavLink
              to="/professor/dashboard"
              className={linkClass}
              onClick={handleNav}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Dashboard
            </NavLink>
            <NavLink
              to="/professor/assignments/create"
              className={linkClass}
              onClick={handleNav}
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Create Assignment
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/student/dashboard"
              className={linkClass}
              onClick={handleNav}
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              My Dashboard
            </NavLink>
          </>
        )}
      </nav>

      {/* Course Shortcuts Section */}
      <div className="mt-6 flex-1 overflow-y-auto">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {isProfessor ? 'My Courses' : 'Enrolled Courses'}
        </p>
        <div className="space-y-1">
          {userCourses.map((c) => {
            const coursePath = isProfessor
              ? `/professor/courses/${c.id}/assignments`
              : `/student/courses/${c.id}/assignments`;
            return (
              <NavLink
                key={c.id}
                to={coursePath}
                onClick={handleNav}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {c.code}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Footer Profile & Actions */}
      <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
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
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
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
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Sign Out
        </button>
      </div>

      <ConfirmationModal
        open={resetOpen}
        title="Reset Demo Data?"
        confirmLabel="Reset Everything"
        variant="danger"
        onCancel={() => setResetOpen(false)}
        onConfirm={handleResetDemo}
      >
        This will restore all initial courses, groups, assignments, and submission states. You will be redirected to the login page.
      </ConfirmationModal>
    </aside>
  );
}
