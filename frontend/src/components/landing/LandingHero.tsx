import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { Hero3DScene } from './Hero3DScene';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Subtle background ambient mesh */}
      <div 
        className="absolute top-0 inset-x-0 h-[480px] opacity-30 dark:opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(56, 189, 248, 0.18), transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center min-h-[520px]">
          
          {/* Left Hero Column: Confident & Editorial Typography */}
          <div className="lg:col-span-6 space-y-7 text-left">
            
            {/* Small Brand Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI DOCUMENT INTELLIGENCE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Every Document Has a Story. <br />
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Verify What Matters.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              DocShield turns documents into structured intelligence, evaluates integrity signals, and helps teams assess compliance through transparent, explainable checks.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg hover:shadow-sky-500/35 transition-all cursor-pointer group"
              >
                <span>Explore DocShield</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="#story"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Compact Supporting Trust Line */}
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Document Intelligence · Integrity Assessment · Compliance</span>
            </div>
          </div>

          {/* Right Hero Column: The Signature 3D Verification Chamber */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <Hero3DScene />
          </div>

        </div>
      </div>
    </section>
  );
};
