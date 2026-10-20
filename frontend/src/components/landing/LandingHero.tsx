import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  FileCheck2, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  Info
} from 'lucide-react';
import { Hero3DScene } from './Hero3DScene';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Multi-Signal Document Intelligence Architecture</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Trust Every Document. <br />
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Verify Every Detail.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              DocShield brings document intelligence, authenticity assessment, and regulatory compliance checks into one transparent verification workflow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all cursor-pointer"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Transparent Sandbox Disclaimer Note */}
            <div className="pt-2 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Demonstration platform operating with synthetic specimens. Simulated verification scores do not represent government credentials.
              </span>
            </div>
          </div>

          {/* Right 3D Visualizer Column */}
          <div className="lg:col-span-6 flex justify-center">
            <Hero3DScene />
          </div>
        </div>

        {/* Section C: Trust and Capability Strip */}
        <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            Core Verification Capabilities
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <FileCheck2 className="w-4 h-4 text-sky-500" />
                <span>Document Intelligence</span>
              </div>
              <p className="text-[11px] text-slate-500">Automated classification, layout parsing & high-precision OCR.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Authenticity Assessment</span>
              </div>
              <p className="text-[11px] text-slate-500">Multi-signal heuristic integrity, metadata, and simulated registry checks.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Scale className="w-4 h-4 text-purple-500" />
                <span>Compliance Validation</span>
              </div>
              <p className="text-[11px] text-slate-500">Declarative policy engine checking expiration, age thresholds & completeness.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Explainable Results</span>
              </div>
              <p className="text-[11px] text-slate-500">Every score is transparently itemized with signals and remediation tips.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
