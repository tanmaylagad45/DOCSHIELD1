import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2
} from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Show/Hide Password State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & UI State
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  // Email regex validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Password strength calculator
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 1; // Base score for any non-empty input
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  };

  const strengthScore = calculateStrength(password);
  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: 'Empty', color: 'bg-slate-200 dark:bg-slate-700' };
    if (score === 1) return { label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { label: 'Moderate', color: 'bg-amber-500' };
    if (score === 3) return { label: 'Strong', color: 'bg-sky-500' };
    return { label: 'Very Strong', color: 'bg-emerald-500' };
  };

  const currentStrength = getStrengthLabel(strengthScore);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(false);

    // Validate
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full legal or operator name is required.';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Work email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid work email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms of service to continue.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Simulate registration
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setDemoSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start verifying documents with explainable AI intelligence"
    >
      {/* Demo Notice Banner */}
      <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-sky-900 dark:text-sky-200">
            Frontend Registration Demo
          </p>
          <p className="text-[11px] text-sky-700 dark:text-sky-300/90 leading-relaxed">
            Form fields are checked locally. Real user provisioning and database storage will be added in Milestone 6.
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
                Registration Simulation Complete
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300/90 leading-relaxed">
                Account created for <strong className="font-mono">{fullName}</strong> (<span className="font-mono">{email}</span>). No database records were modified.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>Explore Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-medium cursor-pointer"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-left" noValidate>
        {/* Full Name Field */}
        <div className="space-y-1">
          <label 
            htmlFor="register-name"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
              }}
              placeholder="Dr. Sarah Connor"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                errors.fullName 
                  ? 'border-rose-500 focus:ring-rose-500/40' 
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
              autoComplete="name"
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label 
            htmlFor="register-email"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Work Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="sarah@fintech.io"
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
        <div className="space-y-1">
          <label 
            htmlFor="register-password"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="At least 8 characters"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                errors.password 
                  ? 'border-rose-500 focus:ring-rose-500/40' 
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
              autoComplete="new-password"
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">Strength:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{currentStrength.label}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-colors ${
                      step <= strengthScore ? currentStrength.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {errors.password && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label 
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Re-enter password"
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                errors.confirmPassword 
                  ? 'border-rose-500 focus:ring-rose-500/40' 
                  : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
              } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Terms Acceptance Checkbox */}
        <div className="pt-1 space-y-1">
          <div className="flex items-start gap-2.5">
            <input
              id="register-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
              }}
              className="w-4 h-4 mt-0.5 rounded-md border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500/40 cursor-pointer accent-sky-500 shrink-0"
            />
            <label
              htmlFor="register-terms"
              className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none"
            >
              I agree to the <span className="text-slate-800 dark:text-slate-200 font-semibold">Terms of Service</span> and acknowledge that this workspace operates in a simulated verification sandbox.
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.agreeTerms}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Provisioning Workspace Demo...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>Already have an account? </span>
        <Link
          to="/login"
          className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
