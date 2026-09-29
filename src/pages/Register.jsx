import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import { isValidEmail } from '../utils/validation';

export default function Register() {
  const { isAuthenticated, user, register, isProfessor } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' | 'professor'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    return (
      <Navigate
        to={isProfessor ? '/professor/dashboard' : '/student/dashboard'}
        replace
      />
    );
  }

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = 'Full name is required.';
    }
    if (!email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Please provide a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!role) {
      nextErrors.role = 'Please select a role.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await register(name, email, password, role);
      if (!result.ok) {
        setErrors({ general: result.error });
        showToast(result.error, 'error');
        return;
      }

      showToast(`Account created! Welcome, ${result.user.name}!`);
      const isProf =
        result.user.role === 'professor' || result.user.role === 'admin';
      navigate(isProf ? '/professor/dashboard' : '/student/dashboard');
    } finally {
      setLoading(false);
    }
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            Join Platform
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Create your account today.
          </h1>
          <p className="text-base text-indigo-200 leading-relaxed max-w-lg">
            Whether you are a student submitting coursework or a professor organizing syllabus assignments, AssignmentHub provides dedicated role-based tools.
          </p>

          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Full support for Student and Professor workflows</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Two-step verified acknowledgment pipeline</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-indigo-100">
              <UserCheck className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Collaborative group leader submission authority</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 text-xs text-indigo-300/80">
          AssignmentHub Academic Portal · Safe & Secure
        </div>
      </section>

      {/* Right Column: Registration Form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Get Started
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Create Account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill in your details below to set up your AssignmentHub profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Role Selector Cards */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select Account Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3.5 border font-bold text-xs transition-all ${
                    role === 'student'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('professor')}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-3.5 border font-bold text-xs transition-all ${
                    role === 'professor'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span>Professor</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  placeholder="e.g. Anand Sahani"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email Address <span className="text-red-500">*</span>
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
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  placeholder="name@university.edu"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="At least 6 characters"
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
              {errors.password && (
                <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-xs transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-semibold text-red-600" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700"
                role="alert"
              >
                {errors.general}
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
              Create Account & Sign In
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
