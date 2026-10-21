import React from 'react';
import { 
  Cpu, 
  CheckSquare, 
  ShieldAlert, 
  Scale, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

interface StoryFallbackProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  reason?: string;
}

export const StoryFallback: React.FC<StoryFallbackProps> = ({
  currentStage,
  onSelectStage,
  reason
}) => {
  const stageInfo = [
    {
      stage: 1,
      badge: 'Stage 1: Inspect',
      title: 'Start with the document.',
      desc: 'DocShield ingests digital and scanned documents in a sandboxed verification environment. Every submitted file receives a cryptographic SHA-256 fingerprint.',
      activeNodes: ['Document Specimen'],
    },
    {
      stage: 2,
      badge: 'Stage 2: Extract',
      title: 'Turn information into structure.',
      desc: 'Optical Character Recognition and layout parsers normalize text, date intervals, and MRZ zones while calculating field-level character confidence scores.',
      activeNodes: ['Text Extraction'],
    },
    {
      stage: 3,
      badge: 'Stage 3: Assess integrity',
      title: 'Look beyond the surface.',
      desc: 'Multi-signal heuristics cross-reference extracted entities with internal consistency markers. The engine evaluates creation metadata, font kerning consistency, and visual anomalies.',
      activeNodes: ['Text Extraction', 'Field Validation', 'Integrity Signals'],
    },
    {
      stage: 4,
      badge: 'Stage 4: Evaluate compliance',
      title: 'Apply the right rules.',
      desc: 'Configurable regulatory rules evaluate credentials against organizational policies. The engine verifies legal minimum age thresholds, document validity intervals, and mandatory fields.',
      activeNodes: ['Text Extraction', 'Field Validation', 'Integrity Signals', 'Compliance Rules'],
    },
    {
      stage: 5,
      badge: 'Stage 5: Explain the result',
      title: 'Make informed decisions.',
      desc: 'All intelligence layers converge into an explainable verification assessment dossier. Rather than presenting a black-box percentage, DocShield itemizes every signal and rule evaluation.',
      activeNodes: ['Text Extraction', 'Field Validation', 'Integrity Signals', 'Compliance Rules', 'Decision Dossier'],
    },
  ];

  const current = stageInfo[currentStage - 1] || stageInfo[0];

  return (
    <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 md:p-8 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Accessible Verification Lab Walkthrough
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {reason || 'Standard Accessible Mode'}
        </span>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {stageInfo.map((s) => (
          <button
            key={s.stage}
            onClick={() => onSelectStage(s.stage)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentStage === s.stage
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            0{s.stage} · {s.badge.split(': ')[1]}
          </button>
        ))}
      </div>

      {/* Main Visual Walkthrough Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Specimen Card & Intelligence Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4">
            
            {/* Specimen Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-xs">
                  ID
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Sample Identity Credential</p>
                  <p className="text-[10px] text-slate-500 font-mono">SPECIMEN · SIMULATED SANDBOX</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                currentStage >= 2 
                  ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {currentStage >= 2 ? 'Scanning Active' : 'Ingested Specimen'}
              </span>
            </div>

            {/* Simulated Document Specimen Fields */}
            <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</span>
                <span className={`font-mono font-bold ${currentStage >= 2 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`}>
                  JANE ELEANOR DOE
                </span>
                {currentStage >= 2 && <span className="text-[10px] text-emerald-500 font-bold">OCR Parsed</span>}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Document ID</span>
                <span className={`font-mono font-bold ${currentStage >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  SPECIMEN-P982410
                </span>
                {currentStage >= 2 && <span className="text-[10px] text-emerald-500 font-bold">Format Valid</span>}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Expiry Date</span>
                <span className={`font-mono font-bold ${currentStage >= 4 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                  2031-08-09
                </span>
                {currentStage >= 4 && <span className="text-[10px] text-emerald-500 font-bold">Unexpired (KYC Pass)</span>}
              </div>

              {/* MRZ Band */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-[9px] text-slate-500 tracking-wider">
                P&lt;SPECIMEN&lt;&lt;DOE&lt;JANE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                P9824102919UTO9205142F3108097&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
              </div>
            </div>

            {/* Connected Intelligence Nodes Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all ${
                currentStage >= 2 
                  ? 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}>
                <Cpu className="w-3.5 h-3.5 text-sky-500" />
                <span>Text Extraction</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all ${
                currentStage >= 3 
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}>
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Field Validation</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all ${
                currentStage >= 3 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                <span>Integrity Signals</span>
              </div>

              <div className={`p-2.5 rounded-xl border text-[11px] font-medium flex items-center gap-2 transition-all ${
                currentStage >= 4 
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300' 
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
              }`}>
                <Scale className="w-3.5 h-3.5 text-purple-500" />
                <span>Compliance Rules</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Narrative Detail & Compact Dossier */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              {current.badge}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {current.desc}
            </p>
          </div>

          {/* Compact Dossier Panel (Stage 5) */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-2.5 ${
            currentStage === 5 
              ? 'border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 shadow-md' 
              : 'border-slate-200/50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/30 opacity-70'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>Verification Dossier</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border border-amber-500/20">
                Review Required
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Extraction:</span>
                <strong className="text-sky-500">Demo complete</strong>
              </div>
              <div className="flex justify-between">
                <span>Field checks:</span>
                <strong className="text-emerald-500">Illustrative results</strong>
              </div>
              <div className="flex justify-between">
                <span>Integrity:</span>
                <strong className="text-amber-500">Signals available</strong>
              </div>
              <div className="flex justify-between">
                <span>Compliance:</span>
                <strong className="text-purple-500">Sample rules evaluated</strong>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <Info className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Illustrative demo — not an actual verification</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
