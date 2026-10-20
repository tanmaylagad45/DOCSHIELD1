import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Scale, 
  Users, 
  FileSpreadsheet, 
  History 
} from 'lucide-react';

export const CoreFeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Intelligent Document Processing',
      description: 'PyMuPDF text layer inspection combined with Tesseract OCR extracts key-value pairs, dates, and MRZ zones with character-level confidence scores.',
      icon: <FileText className="w-5 h-5 text-sky-500" />,
      tag: 'Extraction Engine',
    },
    {
      title: 'Authenticity Signals Heuristics',
      description: 'Multi-signal analysis evaluating PDF structural metadata, typography kerning anomalies, temporal logical consistency, and simulated registry status.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      tag: 'Scoring Matrix',
    },
    {
      title: 'Regulatory Rules Engine',
      description: 'Declarative policy validator verifying compliance with KYC rules (18+ age checks, unexpired status, mandatory fields, address recency thresholds).',
      icon: <Scale className="w-5 h-5 text-purple-500" />,
      tag: 'Policy Enforcement',
    },
    {
      title: 'Case Review Workflow',
      description: 'Human-in-the-loop review queue empowering compliance officers to inspect ambiguous documents, add rationale notes, and record final decisions.',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      tag: 'Human Review',
    },
    {
      title: 'Explainable Reports',
      description: 'Generate transparent, downloadable verification summaries itemizing every evaluated signal, confidence score, and remediation step.',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-500" />,
      tag: 'Audit Documentation',
    },
    {
      title: 'Cryptographic Audit Trail',
      description: 'Immutable, chronological log recording document hashes, ingestion times, automated evaluation signals, and reviewer adjudication notes.',
      icon: <History className="w-5 h-5 text-indigo-500" />,
      tag: 'Governance',
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive Document Intelligence
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Engineered to deliver explainable verification without black-box conclusions or unverified claims.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 font-mono">
                Planned Milestone Specification
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
