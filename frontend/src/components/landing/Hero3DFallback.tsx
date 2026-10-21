import React from 'react';
import { Cpu, ShieldCheck, Sparkles } from 'lucide-react';

interface Hero3DFallbackProps {
  className?: string;
  reason?: string;
}

export const Hero3DFallback: React.FC<Hero3DFallbackProps> = ({ className = '', reason }) => {
  return (
    <div 
      className={`relative w-full max-w-xl aspect-4/3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50/90 via-white to-sky-50/30 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 p-6 shadow-2xl overflow-hidden flex flex-col justify-between select-none ${className}`}
      aria-label="DocShield Verification Chamber"
    >
      {/* Background Precision Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Chamber Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Verification Chamber</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Optical Scanner Active</span>
        </div>
      </div>

      {/* Central Specimen Floating in Chamber */}
      <div className="relative z-10 my-auto py-4">
        {/* Fictional Specimen Card */}
        <div className="relative mx-auto w-80 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-slate-800/95 p-5 shadow-xl space-y-3.5">
          {/* Sweeping optical scanning laser */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent top-1/2 -translate-y-1/2 animate-pulse" />

          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-4 rounded-xs bg-amber-500/80 border border-amber-600 shadow-xs" />
              <div className="space-y-1">
                <div className="h-2 w-28 bg-slate-300 dark:bg-slate-600 rounded-xs" />
                <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-xs" />
              </div>
            </div>
            <span className="text-[9.5px] font-mono font-bold text-sky-500">ID-SPECIMEN</span>
          </div>

          {/* Photo & Field Grid */}
          <div className="flex gap-4 items-center">
            {/* Abstract Photo */}
            <div className="w-16 h-20 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex flex-col items-center justify-center gap-1 shrink-0">
              <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-500" />
              <div className="w-10 h-6 rounded-xs bg-slate-300 dark:bg-slate-500" />
            </div>

            {/* Structured Field Lines */}
            <div className="space-y-2 flex-1">
              <div>
                <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-600 rounded-xs mb-1" />
                <div className="h-2.5 w-full bg-sky-500/20 dark:bg-sky-500/30 border border-sky-500/30 rounded-xs" />
              </div>
              <div>
                <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-600 rounded-xs mb-1" />
                <div className="h-2.5 w-24 bg-slate-300 dark:bg-slate-600 rounded-xs" />
              </div>
              <div>
                <div className="h-1.5 w-10 bg-slate-200 dark:bg-slate-600 rounded-xs mb-1" />
                <div className="h-2.5 w-20 bg-purple-500/20 border border-purple-500/30 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Monospace MRZ Band */}
          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[7.5px] text-slate-500 tracking-wider text-center">
            P&lt;SPECIMEN&lt;&lt;DOE&lt;JANE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
            P9824102919UTO9205142F3108097&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
          </div>
        </div>

        {/* Minimalist Floating Status Badges */}
        <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-sky-500/30 text-[10px] font-semibold text-sky-600 dark:text-sky-300 shadow-sm">
          <Cpu className="w-3 h-3 text-sky-500" />
          <span>Extraction Beacon</span>
        </div>

        <div className="absolute -bottom-2 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-500/30 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Integrity Beacon</span>
        </div>
      </div>

      {/* Chamber Footer */}
      <div className="relative z-10 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Precision Verification Specimen</span>
        <span className="text-[10px] text-slate-400 font-mono">{reason || 'High-performance fallback'}</span>
      </div>
    </div>
  );
};
