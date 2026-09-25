import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, GraduationCap, Lock, Mail, ShieldCheck, User, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { isAuthenticated, user, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

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

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const result = register(name, email, password, role);
    if (!result.ok) {
      setError(result.error);
      showToast(result.error, 'error');
      return;
    }

    showToast(`Account created! Welcome to AssignmentHub, ${result.user.name}!`);
    navigate(
      result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    );
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-slate-50 font-sans antialiased">
      {/* Left Column: Branding Banner */}
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
            Create your free account today.
          </h1>
          <p className="text-base text-indigo-200 leading-relaxed max-w-lg">
            Whether you are a student submitting assignments or a professor organizing course deadlines, AssignmentHub gives you total control.
          </p>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Instant access to student or professor dashboards</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Role-isolated submission verification</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <UserCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Persistent progress tracking & statistics</span>
            </div>
          </div>
        </div>

      </section>

      {/* Right Column: Registration Form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Get Started
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details below to set up your AssignmentHub profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Account Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 border font-bold text-xs transition-all ${
                    role === 'student'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 border font-bold text-xs transition-all ${
                    role === 'admin'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  Admin / Professor
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sahani"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              Create Account & Sign In
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
