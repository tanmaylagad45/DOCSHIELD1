import React from 'react';
import { 
  UploadCloud, 
  Cpu, 
  ShieldCheck, 
  FileCheck2, 
  ArrowRight
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload a Document',
      description: 'Ingest PDF or high-resolution image credentials with client-side file integrity hashing (SHA-256) and format checks.',
      icon: <UploadCloud className="w-5 h-5 text-sky-500" />,
      accentColor: 'border-sky-500/20 bg-sky-500/5',
    },
    {
      step: '02',
      title: 'Extract & Validate',
      description: 'PyMuPDF and OCR extract normalized data fields with individual confidence scores, line groupings, and coordinate bounding boxes.',
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      accentColor: 'border-indigo-500/20 bg-indigo-500/5',
    },
    {
      step: '03',
      title: 'Assess Authenticity',
      description: 'The verification engine weighs digital metadata integrity, font micro-alignment, checksum consistency, and simulated registry status.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      accentColor: 'border-emerald-500/20 bg-emerald-500/5',
    },
    {
      step: '04',
      title: 'Review Findings',
      description: 'Inspect declarative regulatory compliance outputs, address flags via human-in-the-loop case review, and export audit trails.',
      icon: <FileCheck2 className="w-5 h-5 text-purple-500" />,
      accentColor: 'border-purple-500/20 bg-purple-500/5',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            End-to-End Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How DocShield Verifies Documents
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A transparent four-stage pipeline transforming raw document uploads into explainable verification intelligence.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`p-6 rounded-2xl border ${item.accentColor} bg-white dark:bg-slate-900/80 shadow-xs hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400">
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
