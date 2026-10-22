import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2 
} from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation & UI State
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Email regex validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(false);

    // Validate
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g., analyst@docshield.ai).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Simulate validation & submission
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDemoSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DocShield document intelligence workspace"
    >
      {/* Demo Notice Banner */}
      <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-sky-900 dark:text-sky-200">
            Frontend Demonstration Sandbox
          </p>
          <p className="text-[11px] text-sky-700 dark:text-sky-300/90 leading-relaxed">
            Credential submission is validated locally. No passwords or tokens are stored or transmitted.
          </p>
        </div>
      </div>

      {/* Demo Success / Action Banner */}
      {demoSubmitted && (
        <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                Form Validation Successful (Demo)
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                Credentials for <strong className="font-mono">{email}</strong> passed client-side validation. Proceed to explore the operator dashboard or reset.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setDemoSubmitted(false);
                setPassword('');
              }}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-medium cursor-pointer"
            >
              Reset Form
            </button>
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
              }}
              placeholder="operator@enterprise.com"
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
              Remember my device
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
              <span>Validating Credentials...</span>
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
