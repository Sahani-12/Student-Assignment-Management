import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import { isValidEmail } from '../utils/validation';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Login() {
  const { isAuthenticated, user, login, isProfessor } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return (
      <Navigate
        to={isProfessor ? '/professor/dashboard' : '/student/dashboard'}
        replace
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error);
        showToast(result.error, 'error');
        return;
      }
      showToast(`Welcome back, ${result.user.name}!`);
      const isProf =
        result.user.role === 'professor' || result.user.role === 'admin';
      navigate(isProf ? '/professor/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50 font-sans antialiased">
      {/* Left Column: SaaS Branding Banner (Section 7) */}
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Education SaaS Platform
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Manage courses and assignments with clarity & control.
          </h1>
          <p className="text-base text-indigo-200 leading-relaxed max-w-lg">
            A unified academic portal with distinct Professor and Student workflows, collaborative group acknowledgments, and real-time progress analytics.
          </p>

          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Two-step submission confirmation and verification</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <Users className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Group submission logic with designated Group Leader authority</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <UserCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Role-isolated privacy & aggregate course analytics</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 text-xs text-indigo-300/80">
          AssignmentHub Academic Portal · Version 2.0
        </div>
      </section>

      {/* Right Column: Interactive Login Form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {getGreeting()}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@university.edu"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password Field with Visibility Toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 animate-in fade-in"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          {/* Registration Prompt */}
          <div className="text-center border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Demo Accounts Quick-Fill Panel */}
          <div className="rounded-2.5xl border border-slate-200 bg-white p-5 shadow-card space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Demo Accounts
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                1-Click Autofill
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {/* Professor Account */}
              <button
                type="button"
                onClick={() =>
                  fillDemoUser('admin@assignmenthub.com', '123456')
                }
                className="group flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-purple-400 hover:bg-purple-50/40 hover:shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700">
                    Dr. Sharma
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                    Professor
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 truncate mt-1">
                  admin@assignmenthub.com
                </span>
                <span className="text-[10px] text-slate-400">Pass: 123456</span>
              </button>

              {/* Student 1 (Anand) */}
              <button
                type="button"
                onClick={() => fillDemoUser('anand@student.com', '123456')}
                className="group flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">
                    Anand Sahani
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                    Student
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 truncate mt-1">
                  anand@student.com
                </span>
                <span className="text-[10px] text-slate-400">Pass: 123456</span>
              </button>

              {/* Student 2 (Rahul - Leader) */}
              <button
                type="button"
                onClick={() => fillDemoUser('rahul@student.com', '123456')}
                className="group flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700">
                    Rahul Kumar
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                    ★ Leader
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 truncate mt-1">
                  rahul@student.com
                </span>
                <span className="text-[10px] text-slate-400">Team Phoenix</span>
              </button>

              {/* Professor 2 (Dr. Mehta) */}
              <button
                type="button"
                onClick={() => fillDemoUser('mehta@professor.com', '123456')}
                className="group flex flex-col text-left rounded-xl border border-slate-200 p-3 transition hover:border-purple-400 hover:bg-purple-50/40 hover:shadow-xs active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700">
                    Dr. Mehta
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                    Faculty
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-600 truncate mt-1">
                  mehta@professor.com
                </span>
                <span className="text-[10px] text-slate-400">Software Eng.</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
