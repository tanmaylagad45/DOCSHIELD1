import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
      {/* Final CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Explore Document Intelligence?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access the interactive dashboard workspace to test synthetic document analysis, inspect OCR bounding boxes, and evaluate compliance policies.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all shrink-0 cursor-pointer"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100 dark:border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                DocShield
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-powered document intelligence, authenticity assessment, and regulatory compliance verification platform.
            </p>
          </div>

          {/* Links 1: Platform Modules */}
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

          {/* Links 2: Governance & Policies */}
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

          {/* Links 3: Project Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Milestone Status
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Milestone 2 Frontend Foundation & 3D Landing Page active. Backend FastAPI integration scheduled for subsequent milestones.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Frontend v1.0-alpha
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
