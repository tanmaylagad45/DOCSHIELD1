import React from 'react';
import { 
  UploadCloud, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      action: 'Submit',
      title: 'Specimen Intake',
      description: 'Ingest vector PDFs or high-resolution credentials with client-side SHA-256 fingerprinting for immutable audit tracking.',
      icon: <UploadCloud className="w-5 h-5 text-sky-500" />,
      accentBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    },
    {
      step: '02',
      action: 'Extract',
      title: 'Structured Parsing',
      description: 'PyMuPDF and Tesseract OCR extract normalized field entities, dates, and MRZ zones with character confidence scores.',
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      accentBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      step: '03',
      action: 'Assess',
      title: 'Signals & Policies',
      description: 'Multi-signal heuristics evaluate metadata consistency and typography while declarative rules check compliance thresholds.',
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      step: '04',
      action: 'Review',
      title: 'Decision Support',
      description: 'Inspect itemized signal breakdowns, record reviewer adjudication notes, and export transparent verification dossiers.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <section id="workflow" className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The Verification Sequence
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            A clean four-stage workflow transforming submitted credentials into structured, explainable intelligence.
          </p>

          {/* Workflow Sequence Summary */}
          <div className="inline-flex items-center gap-2 pt-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
            <span>Submit</span>
            <span className="text-slate-400">→</span>
            <span>Extract</span>
            <span className="text-slate-400">→</span>
            <span>Assess</span>
            <span className="text-slate-400">→</span>
            <span>Review</span>
          </div>
        </div>

        {/* 4 Refined Sequence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                {/* Step Header */}
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${item.accentBg}`}>
                    {item.icon}
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-black text-slate-300 dark:text-slate-700">
                      {item.step}
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 -mt-1">
                      {item.action}
                    </p>
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Connecting arrow indicator for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-400 shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
