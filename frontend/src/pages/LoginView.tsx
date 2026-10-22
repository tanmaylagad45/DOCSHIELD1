import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & UI State
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // If already logged in, redirect to intended page or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Email regex validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Work email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DocShield document intelligence workspace"
    >
      {/* Security Status Badge */}
      <div className="p-3 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sky-800 dark:text-sky-300 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
        <span className="text-[11.5px] text-slate-600 dark:text-slate-300">
          Protected by Argon2id cryptographic password hashing and HTTP-only session tokens.
        </span>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-900 dark:text-rose-200">Sign in failed</p>
            <p className="text-[11.5px] leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="login-email"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Work Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (serverError) setServerError(null);
              }}
              placeholder="operator@docshield.ai"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                errors.email 
                  ? 'border-rose-500 focus:ring-rose-500/40' 
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                if (serverError) setServerError(null);
              }}
              placeholder="••••••••••••"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                errors.password 
                  ? 'border-rose-500 focus:ring-rose-500/40' 
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <input
              id="login-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-md border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500/40 cursor-pointer accent-sky-500"
            />
            <label
              htmlFor="login-remember"
              className="text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer select-none"
            >
              Remember my device (7 days)
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Don&apos;t have a DocShield workspace? </span>
        <Link
          to="/register"
          className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
};
