import React from 'react';
import { 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const VerificationPreviewSection: React.FC = () => {
  return (
    <section id="preview" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Verification Workspace
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Experience how DocShield presents extracted entities, explainable authenticity signals, and regulatory rules in a unified view.
          </p>

          {/* Mandatory Simulated Specimen Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Info className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Illustrative demo — simulated data. Not connected to a real government database.</span>
          </div>
        </div>

        {/* Mock Product Interface Frame */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Mock Window Title Bar */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                DocShield / Document Inspector / SPECIMEN_PASSPORT_SAMPLE.pdf
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Simulated Analysis Mode
            </span>
          </div>

          {/* Workspace Body */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Specimen Preview & Extracted Fields */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Extracted Field Entities
                </span>
                <span className="text-[11px] text-slate-400">6 Normalized Fields</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden text-xs">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Full Name</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">JANE ELEANOR DOE</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold">OCR Confidence</span>
                    <p className="font-bold text-emerald-500">98.4%</p>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Document Number</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">P982410291</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold">OCR Confidence</span>
                    <p className="font-bold text-emerald-500">99.1%</p>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Date of Birth</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">1992-05-14 (Age 34)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold">OCR Confidence</span>
                    <p className="font-bold text-emerald-500">97.5%</p>
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Expiration Date</span>
                    <p className="font-bold text-slate-900 dark:text-white font-mono">2031-08-09 (Valid)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold">OCR Confidence</span>
                    <p className="font-bold text-emerald-500">98.5%</p>
                  </div>
                </div>
              </div>

              {/* MRZ Zone Bar */}
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                P&lt;UTOPOEDOE&lt;&lt;JANE&lt;ELEANOR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                P9824102919UTO9205142F3108097&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
              </div>
            </div>

            {/* Right Column: Authenticity Score & Regulatory Rules */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Verification Evaluation
                </span>
                <Badge status="VERIFIED" size="sm" />
              </div>

              {/* Score Highlight Card */}
              <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Authenticity Score
                  </span>
                  <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                    94%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="w-[94%] h-full bg-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Recommendation: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">ACCEPT</strong> (Multi-signal threshold met).
                </p>
              </div>

              {/* Compliance Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Regulatory Compliance Checks
                </span>
                
                <div className="space-y-1.5 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">KYC-AGE-18: Legal Age Check</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">EXP-VALID: Unexpired Credential</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">TAMPER: Font Kerning & Splicing</span>
                    <span className="font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulated Registry Indicator */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulated Registry</span>
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ACTIVE_ISSUED
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
