import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

interface SimulationBannerProps {
  compact?: boolean;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-500" />
        <span>
          <strong className="font-semibold">Simulated Verification Environment:</strong> Results are synthetic for testing & demonstration only. OCR confidence alone never confirms authenticity.
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 text-amber-900 dark:text-amber-200 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold tracking-tight text-amber-950 dark:text-amber-100">
              Synthetic Testing & Simulated Verification Notice
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              Sandbox Mode
            </span>
          </div>
          <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            DocShield is currently operating on <strong>synthetic test documents</strong> with simulated issuer responses. 
            Simulated results do not represent official government or legal verification. 
            Furthermore, <strong>OCR character confidence alone does not establish document authenticity</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
