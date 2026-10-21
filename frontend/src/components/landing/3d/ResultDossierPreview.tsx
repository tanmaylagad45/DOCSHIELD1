import React from 'react';
import { Html } from '@react-three/drei';
import { FileCheck, ShieldAlert, CheckCircle2, Scale, Info } from 'lucide-react';

interface ResultDossierPreviewProps {
  isDark: boolean;
}

export const ResultDossierPreview: React.FC<ResultDossierPreviewProps> = ({ isDark }) => {
  return (
    // Docked at the lower right to avoid occluding the main document specimen
    <Html position={[0.65, -0.28, 0.35]} center>
      <div
        className={`w-64 p-3 rounded-2xl border shadow-xl backdrop-blur-xl space-y-2 select-none pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95 ${
          isDark
            ? 'bg-slate-900/94 border-sky-500/35 text-slate-100'
            : 'bg-white/95 border-slate-200/90 text-slate-900'
        }`}
        style={{
          boxShadow: isDark
            ? '0 12px 32px -4px rgba(2, 132, 199, 0.3), 0 0 16px -2px rgba(56, 189, 248, 0.2)'
            : '0 12px 28px -4px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Dossier Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Assessment Dossier
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25">
            Review Required
          </span>
        </div>

        {/* Evaluation Summary Rows */}
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Extraction:</span>
            </span>
            <strong className="text-sky-600 dark:text-sky-400 font-semibold">Demo complete</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Field checks:</span>
            </span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Illustrative results</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Integrity:</span>
            </span>
            <strong className="text-amber-600 dark:text-amber-400 font-semibold">Signals available</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-500" />
              <span>Compliance:</span>
            </span>
            <strong className="text-purple-600 dark:text-purple-400 font-semibold">Sample rules evaluated</strong>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer */}
        <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-1.5 text-[8.5px] text-slate-500 dark:text-slate-400">
          <Info className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="font-semibold uppercase tracking-wider">
            Illustrative Demo — Not an Actual Verification
          </span>
        </div>
      </div>
    </Html>
  );
};
