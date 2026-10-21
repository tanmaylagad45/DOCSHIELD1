import React from 'react';
import { 
  FileText, 
  ShieldAlert, 
  Scale, 
  Database,
  Lock,
  Sparkles
} from 'lucide-react';

export const ResponsibleSecuritySection: React.FC = () => {
  const distinctions = [
    {
      title: 'Extracted Document Information',
      subtitle: 'Optical Legibility ≠ Authenticity',
      description: 'OCR and layout parsers convert pixels into structured text. A 99% character confidence score simply confirms optical clarity; optical legibility alone never establishes that a credential is genuine.',
      icon: <FileText className="w-5 h-5 text-sky-500" />,
      tag: 'Extraction',
    },
    {
      title: 'Field Validation & Integrity Signals',
      subtitle: 'Heuristic Indicators ≠ Conclusive Proof',
      description: 'Multi-signal heuristics examine typography kerning, compression block anomalies, and MRZ checksums. These indicators surface anomalies for investigation, but do not prove legal authenticity.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      tag: 'Integrity',
    },
    {
      title: 'Configurable Compliance Rules',
      subtitle: 'Policy Eligibility ≠ Physical Validity',
      description: 'Declarative policies evaluate whether credentials satisfy jurisdictional criteria (such as minimum age 18+, validity periods, and mandatory fields) according to organizational risk appetite.',
      icon: <Scale className="w-5 h-5 text-purple-500" />,
      tag: 'Compliance',
    },
    {
      title: 'Authoritative Issuer Verification',
      subtitle: 'Official Registries & PKI Integrations',
      description: 'Definitive authenticity requires authorized direct connectivity with official government registries or cryptographic PKI roots. In this demo sandbox, all queries use deterministic synthetic simulation.',
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      tag: 'Issuer Authority',
    },
  ];

  return (
    <section id="transparency" className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide shadow-xs">
            <Lock className="w-3.5 h-3.5 text-sky-500" />
            <span>RESPONSIBLE VERIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Understanding the Verification Spectrum
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Responsible document verification requires distinguishing between extracted text, heuristic indicators, compliance policies, and official issuer authority.
          </p>
        </div>

        {/* 4 Clean Distinction Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {distinctions.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold">
                  {item.tag}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Calm Trust Note */}
        <div className="text-center text-xs text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span>DocShield operates with synthetic specimen models to demonstrate pipeline transparency.</span>
        </div>

      </div>
    </section>
  );
};
