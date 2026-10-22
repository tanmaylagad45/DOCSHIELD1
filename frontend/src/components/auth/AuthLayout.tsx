import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Cpu, 
  Lock, 
  Scale, 
  Sparkles 
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                DocShield
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Auth Demo
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Landing Page</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Soft background ambient gradient */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-25"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(2, 132, 199, 0.15) 0%, transparent 65%)',
          }}
        />

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left / Secondary: DocShield Intelligence Visual Showcase (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/60 via-slate-50/40 to-sky-50/20 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950/60 backdrop-blur-xl shadow-xl">
            
            {/* Top Showcase Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>SECURE ACCESS PORTAL</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Transparent Document Verification for Modern Teams
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Log in to inspect extracted field coordinates, evaluate multi-signal heuristics, and manage regulatory KYC compliance cases.
              </p>
            </div>

            {/* Specimen Security Card Graphic */}
            <div className="relative p-5 rounded-2xl border border-sky-500/30 bg-slate-900 text-white shadow-lg overflow-hidden space-y-4 select-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-4 rounded-xs bg-amber-500 border border-amber-600 flex items-center justify-center">
                    <div className="w-2.5 h-2 border-t border-b border-amber-700" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400">
                    DS-VERIFY-SPECIMEN
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  TAMPER-CHECKED
                </span>
              </div>

              {/* Simulated Card Silhouette Lines */}
              <div className="space-y-2">
                <div className="w-3/4 h-2.5 rounded-sm bg-slate-700" />
                <div className="w-1/2 h-2 rounded-sm bg-slate-800" />
                <div className="w-5/6 h-2 rounded-sm bg-slate-800" />
              </div>

              {/* MRZ Band */}
              <div className="pt-2 border-t border-slate-800/80 font-mono text-[8px] text-sky-400 tracking-widest truncate">
                P&lt;UTOALPHASEC&lt;&lt;JOHN&lt;DOE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </div>

              {/* Sweeping optical accent line */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-60" />
            </div>

            {/* Value Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 mt-0.5">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Structured OCR &amp; MRZ Extraction
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Character-level confidence ratings and visual coordinate tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Forensic Heuristics Assessment
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Digital metadata timestamps, font baselines, and cross-field checks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Declarative KYC Policies
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Configurable age limits, validity intervals, and address recency.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Trust Note */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Demo Sandbox Mode</span>
              <span className="font-mono text-sky-500 font-semibold">Milestone 2</span>
            </div>
          </div>

          {/* Right / Main: Authentication Form Container */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto">
            <div className="p-6 sm:p-9 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xl space-y-6">
              
              {/* Form Heading */}
              <div className="space-y-1.5 text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              </div>

              {/* Form Body */}
              {children}

            </div>
          </div>

        </div>
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full py-4 text-center text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 px-4">
        <span>DocShield Document Intelligence · Frontend Demonstration Environment · No Live Passwords Stored</span>
      </footer>
    </div>
  );
};
