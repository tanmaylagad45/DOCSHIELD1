import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CoreFeaturesSection: React.FC = () => {
  return (
    <section id="capabilities" className="py-24 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Transparent Document Intelligence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Three foundational architectural systems designed to extract structure, inspect forensic indicators, and enforce regulatory policies with complete explainability.
          </p>
        </div>

        {/* 3 Varied, Elegant Capability Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Capability 1: Document Intelligence */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Document Intelligence
                </h3>
                <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                  Extract and organize document information
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Transform scanned credentials and vector PDFs into normalized data models. High-precision OCR parses structured fields, identifiers, and machine-readable zones with word-level confidence ratings.
              </p>
            </div>

            {/* Clean Visual Sample */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">DOE, JANE ELEANOR</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">Document ID</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">P98241029</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">MRZ Checksum</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">VERIFIED (04)</span>
              </div>
            </div>
          </div>

          {/* Capability 2: Integrity Assessment */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Integrity Assessment
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Examine available integrity signals & field consistency
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Evaluate structural PDF metadata, typographical kerning uniformity, and cross-field coherence. Multi-signal heuristics surface indicators of tampering without making unverified authenticity claims.
              </p>
            </div>

            {/* Clean Visual Sample */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Typography Consistency</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Match
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Cross-Field Correlation</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aligned
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Metadata Structure</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Audit Flag
                </span>
              </div>
            </div>
          </div>

          {/* Capability 3: Compliance Engine */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Compliance Engine
                </h3>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Evaluate configurable rules & explain results
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Validate extracted information against declarative regulatory policies. Assess age criteria (18+), expiration thresholds, and mandatory field requirements with transparent rationale for every outcome.
              </p>
            </div>

            {/* Clean Visual Sample */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">RULE-AGE-18+</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">PASS (Age 34)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">RULE-EXPIRY</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">PASS (Valid 2031)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span className="font-mono text-[11px]">RULE-MANDATORY</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">REVIEW NOTE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
