import React from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Database, 
  Scale, 
  Lock 
} from 'lucide-react';

export const ResponsibleSecuritySection: React.FC = () => {
  const securityPillars = [
    {
      title: 'OCR Is Not Authenticity',
      description: 'High OCR confidence merely signifies that characters are optically legible. Genuine authenticity requires multi-signal inspection of layout, digital metadata, font metrics, and registry status.',
      icon: <Cpu className="w-5 h-5 text-sky-500" />,
    },
    {
      title: 'Authorized Verification Sources',
      description: 'Direct issuer validation requires authorized external integration with official government registries or PKI certificate authorities. In this release, all registry queries use deterministic synthetic simulation.',
      icon: <Database className="w-5 h-5 text-indigo-500" />,
    },
    {
      title: 'Jurisdiction-Aware Compliance',
      description: 'Regulatory compliance rules are configurable policies that depend on the specific legal jurisdiction, organization risk profile, and document type rather than universal binary rules.',
      icon: <Scale className="w-5 h-5 text-purple-500" />,
    },
    {
      title: 'Simulated Sandbox Environment',
      description: 'DocShield currently operates in a local sandbox mode using synthetic test documents. No user document content is transmitted to external cloud APIs without explicit authorization.',
      icon: <Lock className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <section id="security" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Ethical AI & Verification Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security & Responsible Verification
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Document verification demands rigorous technical transparency, explicit limitations, and principled safeguards.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
