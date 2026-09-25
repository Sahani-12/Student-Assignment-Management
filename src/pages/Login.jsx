import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, Lock, Mail, RotateCcw, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/common/Modal';
import { resetDemoData } from '../utils/storage';
import { useAssignments } from '../context/AssignmentsContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Login() {
  const { isAuthenticated, user, login } = useAuth();
  const { showToast } = useToast();
  const { refresh } = useAssignments();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);

  if (isAuthenticated) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
        replace
      />
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      showToast(result.error, 'error');
      return;
    }
    showToast(`Welcome back, ${result.user.name}!`);
    navigate(
      result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    );
  };

  const fillDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleReset = () => {
    resetDemoData();
    refresh();
    setResetOpen(false);
    showToast('Demo data restored');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50 font-sans antialiased">
      {/* Left Column: SaaS Branding Banner */}
      <section className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white lg:p-14 lg:max-w-xl xl:max-w-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 shadow-lg">
            <BookOpen className="h-6 w-6 text-indigo-300" aria-hidden="true" />
            <span className="text-lg font-bold tracking-tight">AssignmentHub</span>
          </div>
        </div>

        <div className="relative z-10 my-12 space-y-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Manage your assignments with confidence & clarity.
          </h1>
          <p className="text-base text-indigo-200 leading-relaxed max-w-lg">
            Role-based student portal designed for seamless course management, real-time submission verification, and intuitive progress tracking.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Two-step submission confirmation flow</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <UserCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Role-specific privacy & student isolation</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Persistent progress metrics & local state</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-300 border-t border-white/10 pt-4">
          Built with React 19, Vite, Tailwind CSS & localStorage
        </div>
      </section>

      {/* Right Column: Interactive Login Form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {getGreeting()}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a demo account below, enter credentials, or create a new account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@student.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Demo Credentials Quick Fill */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Demo Accounts</span>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemoUser('anand@student.com', '123456')}
                className="flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-indigo-500 hover:bg-indigo-50/50"
              >
                <span className="text-xs font-bold text-indigo-700">Student Account</span>
                <span className="text-[11px] font-medium text-slate-600 truncate">anand@student.com</span>
                <span className="text-[10px] text-slate-400">Pass: 123456</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemoUser('admin@assignmenthub.com', '123456')}
                className="flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-indigo-500 hover:bg-indigo-50/50"
              >
                <span className="text-xs font-bold text-indigo-700">Admin / Professor</span>
                <span className="text-[11px] font-medium text-slate-600 truncate">admin@assignmenthub.com</span>
                <span className="text-[10px] text-slate-400">Pass: 123456</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center pt-2">
            {/* <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset Demo Data to Initial State
            </button> */}
          </div>
        </div>
      </section>

      <ConfirmationModal
        open={resetOpen}
        title="Reset Demo Data?"
        confirmLabel="Reset"
        variant="danger"
        onCancel={() => setResetOpen(false)}
        onConfirm={handleReset}
      >
        This action will clear custom assignments and submission records, restoring the original mock dataset.
      </ConfirmationModal>
    </div>
  );
}
