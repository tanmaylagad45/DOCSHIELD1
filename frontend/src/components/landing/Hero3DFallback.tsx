import React from 'react';
import { ShieldCheck, FileText, CheckCircle2, Cpu, Scale } from 'lucide-react';

interface Hero3DFallbackProps {
  className?: string;
  reason?: string;
}

export const Hero3DFallback: React.FC<Hero3DFallbackProps> = ({ className = '', reason }) => {
  return (
    <div 
      className={`relative w-full max-w-lg aspect-4/3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 shadow-xl overflow-hidden flex flex-col justify-between select-none ${className}`}
      aria-label="Interactive Document Verification Visualizer"
    >
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Floating Meta Banner */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-[11px] font-semibold">
          <FileText className="w-3.5 h-3.5 text-sky-500" />
          <span>Fictional Sample Specimen</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Pipeline Active</span>
        </div>
      </div>

      {/* Central Visual Architecture */}
      <div className="relative z-10 my-auto py-2">
        {/* Document Silhouette Card */}
        <div className="relative mx-auto w-64 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 p-4 shadow-md space-y-3">
          {/* Simulated scanning beam */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent animate-pulse top-1/2 -translate-y-1/2 opacity-70" />

          {/* Header Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="h-2.5 w-24 bg-slate-300 dark:bg-slate-600 rounded-sm" />
              <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-sm" />
            </div>
          </div>

          {/* Field rows */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-sm" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">99.2% Conf.</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <div className="h-2 w-20 bg-slate-200 dark:bg-slate-700 rounded-sm" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Checksum Match</span>
            </div>
          </div>

          {/* MRZ footer strip */}
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700/50" />
        </div>

        {/* Central Verification Shield Floating Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-xl shadow-sky-500/25 border border-sky-400/40">
            <ShieldCheck className="w-8 h-8" />
            <div className="absolute -inset-1 rounded-2xl border border-sky-400/30 animate-ping pointer-events-none opacity-40" />
          </div>
        </div>

        {/* Floating Analysis Indicator Badges */}
        <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          <Cpu className="w-3.5 h-3.5 text-sky-500" />
          <span>OCR Extraction</span>
        </div>

        <div className="absolute -bottom-2 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          <Scale className="w-3.5 h-3.5 text-indigo-500" />
          <span>Rules Evaluation</span>
        </div>

        <div className="absolute top-1/2 -right-2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 shadow-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Authentic Layout</span>
        </div>
      </div>

      {/* Bottom Subtitle / Notice */}
      <div className="relative z-10 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Illustrative Multi-Signal Pipeline Model</span>
        <span className="text-[10px] text-slate-400">{reason || 'High-performance visual mode'}</span>
      </div>
    </div>
  );
};
