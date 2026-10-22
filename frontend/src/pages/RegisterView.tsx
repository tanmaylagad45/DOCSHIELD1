import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

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
  const [serverError, setServerError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Email regex validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Password strength calculator
  const calculateStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 1;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

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
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain uppercase and lowercase letters.';
    } else if (!/[0-9!@#$%^&*(),.?":{}|<>\-_+=]/.test(password)) {
      newErrors.password = 'Password must contain at least one number or special character.';
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

    setIsLoading(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        agreeTerms,
      });

      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start verifying documents with explainable AI intelligence"
    >
      {/* Security Status Badge */}
      <div className="p-3 rounded-xl border border-sky-500/20 bg-sky-500/5 text-sky-800 dark:text-sky-300 text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
        <span className="text-[11.5px] text-slate-600 dark:text-slate-300">
          Operator accounts are secured with Argon2 password hashing and audited event logging.
        </span>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-rose-900 dark:text-rose-200">Registration Failed</p>
            <p className="text-[11.5px] leading-relaxed">{serverError}</p>
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
                if (serverError) setServerError(null);
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
                if (serverError) setServerError(null);
              }}
              placeholder="sarah@docshield.ai"
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
                if (serverError) setServerError(null);
              }}
              placeholder="At least 8 characters with Aa & 1-9"
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
                if (serverError) setServerError(null);
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
                if (serverError) setServerError(null);
              }}
              className="w-4 h-4 mt-0.5 rounded-md border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500/40 cursor-pointer accent-sky-500 shrink-0"
            />
            <label
              htmlFor="register-terms"
              className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-snug cursor-pointer select-none"
            >
              I agree to the <span className="text-slate-800 dark:text-slate-200 font-semibold">Terms of Service</span> and acknowledge enterprise data verification guidelines.
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
              <span>Registering Account...</span>
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
