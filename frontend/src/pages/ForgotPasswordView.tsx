import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';

export const ForgotPasswordView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Email regex validator
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide your registered work email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please provide a valid email address format.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setError(null);
  };

  return (
    <AuthLayout
      title={isSubmitted ? 'Check your simulated inbox' : 'Reset password'}
      subtitle={
        isSubmitted
          ? 'Password recovery instructions have been simulated'
          : 'Enter your registered email to receive recovery instructions'
      }
    >
      {isSubmitted ? (
        /* Confirmation Screen */
        <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-300">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recovery Simulation Dispatched
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                If an active DocShield account were linked to <strong className="font-mono text-emerald-600 dark:text-emerald-400">{email}</strong>, a cryptographically signed recovery token would be issued.
              </p>
            </div>
          </div>

          {/* Prominent Demo Mode Disclaimer */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-950 dark:text-amber-100">
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Frontend Demonstration Environment</span>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              No outbound SMTP servers or password-reset APIs are linked in this milestone. This screen confirms UI flow, validation, and accessibility criteria.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to="/login"
              className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Use Another Email</span>
            </button>
          </div>
        </div>
      ) : (
        /* Email Submission Form */
        <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
          {/* Demo Notice Banner */}
          <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-sky-900 dark:text-sky-200">
                Password Recovery Sandbox
              </p>
              <p className="text-[11px] text-sky-700 dark:text-sky-300/90 leading-relaxed">
                Enter your work address to test the recovery sequence and review the simulated delivery screen.
              </p>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="forgot-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Registered Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="operator@enterprise.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60 border ${
                  error 
                    ? 'border-rose-500 focus:ring-rose-500/40' 
                    : 'border-slate-200 dark:border-slate-800 focus:ring-sky-500/40'
                } text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 transition-all`}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="flex items-center gap-1 text-[11px] text-rose-500 font-medium pt-0.5" role="alert">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
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
                <span>Sending Recovery Instructions...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="pt-3 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
