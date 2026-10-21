import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-colors">
      
      {/* Final CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-8 sm:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Bring clarity to document verification.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Experience how DocShield combines structured document intelligence, transparent integrity signals, and declarative compliance rules in an open sandbox.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all shrink-0 cursor-pointer group"
          >
            <span>Explore DocShield</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Clean Minimal Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-850">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                DocShield
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI document intelligence, authenticity assessment, and regulatory compliance verification platform.
            </p>
          </div>

          {/* Links: Platform Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/dashboard" className="hover:text-sky-500 transition-colors">Dashboard Overview</Link></li>
              <li><Link to="/documents" className="hover:text-sky-500 transition-colors">Document Repository</Link></li>
              <li><Link to="/upload" className="hover:text-sky-500 transition-colors">Document Ingestion</Link></li>
              <li><Link to="/cases" className="hover:text-sky-500 transition-colors">Cases & Review</Link></li>
            </ul>
          </div>

          {/* Links: Governance & Policies */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Governance & Rules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/compliance" className="hover:text-sky-500 transition-colors">Compliance Rules Engine</Link></li>
              <li><Link to="/audit" className="hover:text-sky-500 transition-colors">Audit Trail Logs</Link></li>
              <li><Link to="/reports" className="hover:text-sky-500 transition-colors">Verification Reports</Link></li>
              <li><Link to="/settings" className="hover:text-sky-500 transition-colors">Platform Settings</Link></li>
            </ul>
          </div>

          {/* Specification Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform Status
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Frontend v1.0 active. Verification Chamber specimen operating with synthetic data in sandbox mode.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Frontend v1.0-alpha
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 DocShield Project. Built for portfolio & educational demonstration.
          </p>
          <p className="text-[11px] text-slate-400 max-w-md text-center sm:text-right">
            Disclaimer: All specimens and issuer responses are synthetic simulations. Not affiliated with any official government authority.
          </p>
        </div>
      </div>
    </footer>
  );
};
