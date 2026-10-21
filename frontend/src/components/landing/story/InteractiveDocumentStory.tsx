import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DocumentVerification3D } from './DocumentVerification3D';
import { StoryFallback } from './StoryFallback';
import { 
  FileText, 
  Cpu, 
  ShieldAlert, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// WebGL Error Boundary
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const InteractiveDocumentStory: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [canRenderWebGL, setCanRenderWebGL] = useState<boolean | null>(null);

  const stageRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCanRenderWebGL(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setCanRenderWebGL(!!gl);
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  // Smooth IntersectionObserver for bidirectional scrolling
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stageRefs.forEach((ref, index) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveStage(index + 1);
            }
          });
        },
        {
          rootMargin: '-25% 0px -40% 0px',
          threshold: 0.25,
        }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleStageSelect = (stage: number) => {
    setActiveStage(stage);
    const targetRef = stageRefs[stage - 1];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const stages = [
    {
      number: 1,
      badge: '01 · Inspect',
      headline: 'Start with the document.',
      description: 'A submitted credential enters the verification chamber. Format layers are indexed and a cryptographic SHA-256 fingerprint is computed to establish an immutable audit trail from moment zero.',
      icon: <FileText className="w-4 h-4 text-sky-500" />,
      subline: 'Cryptographic Fingerprint · Format Parsing'
    },
    {
      number: 2,
      badge: '02 · Extract',
      headline: 'Turn information into structure.',
      description: 'The precision optical beam traverses the document. OCR and layout models parse field boundaries, dates, and MRZ zones while calculating character-level confidence scores.',
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
      subline: 'Structured Field Extraction · MRZ Validation'
    },
    {
      number: 3,
      badge: '03 · Assess integrity',
      headline: 'Look beyond the surface.',
      description: 'Multi-signal heuristics cross-reference extracted entities with internal consistency markers. The engine evaluates typography alignment, creation metadata, and compression blocks to surface forensic indicators.',
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      subline: 'Typography Heuristics · Metadata Consistency'
    },
    {
      number: 4,
      badge: '04 · Evaluate compliance',
      headline: 'Apply the right rules.',
      description: 'Declarative policies evaluate credentials against organizational criteria. Configurable checks verify legal age limits (18+), expiration status, and mandatory field completeness.',
      icon: <Scale className="w-4 h-4 text-purple-500" />,
      subline: 'Configurable KYC Policies · Age Thresholds'
    },
    {
      number: 5,
      badge: '05 · Explain the result',
      headline: 'Make informed decisions.',
      description: 'All intelligence layers synthesize into an explainable verification dossier. Rather than presenting a black-box conclusion, DocShield itemizes every evaluated signal so teams can act with confidence.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      subline: 'Itemized Dossier · Human-in-the-Loop Review'
    },
  ];

  return (
    <section id="story" className="relative py-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>VERIFICATION JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How DocShield Analyzes Credentials
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Follow the five progressive stages of the DocShield pipeline — from specimen intake to structured extraction, integrity assessment, and explainable decision support.
          </p>

          {/* Clean Stage Selector Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {stages.map((s) => (
              <button
                key={s.number}
                onClick={() => handleStageSelect(s.number)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeStage === s.number
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-500'
                }`}
                aria-label={`Jump to stage ${s.number}`}
              >
                {s.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Fallback Rendering if WebGL is unavailable */}
        {canRenderWebGL === false ? (
          <StoryFallback 
            currentStage={activeStage} 
            onSelectStage={handleStageSelect}
            reason="Standard accessible walkthrough active"
          />
        ) : (
          /* Two-Column Storytelling: Left Narrative Progression + Right Sticky 3D Chamber */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative">
            
            {/* Left Column: Clean, Editorial Stage Cards */}
            <div className="lg:col-span-5 space-y-10 py-2">
              {stages.map((stage, idx) => {
                const isActive = activeStage === stage.number;

                return (
                  <div
                    key={stage.number}
                    ref={stageRefs[idx]}
                    className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 space-y-4 ${
                      isActive
                        ? 'border-sky-500/40 bg-white dark:bg-slate-900 shadow-xl shadow-sky-500/5 ring-1 ring-sky-500/20'
                        : 'border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 opacity-70 hover:opacity-90'
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                          {stage.icon}
                        </div>
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                          {stage.badge}
                        </span>
                      </div>
                      <span className="font-mono text-xl font-bold text-slate-300 dark:text-slate-700">
                        0{stage.number}
                      </span>
                    </div>

                    {/* Headline & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {stage.headline}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    {/* Subline & Action */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">
                        {stage.subline}
                      </span>
                      {stage.number === 5 ? (
                        <Link
                          to="/dashboard"
                          className="inline-flex items-center gap-1 font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          <span>Explore Platform</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleStageSelect(stage.number + 1)}
                          className="inline-flex items-center gap-0.5 font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Sticky 3D Verification Chamber */}
            <div className="lg:col-span-7 sticky top-24 self-start space-y-3">
              <div className="relative w-full h-[480px] lg:h-[540px] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-br from-slate-100/90 via-white to-sky-50/20 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950 shadow-2xl overflow-hidden flex items-center justify-center select-none">
                
                {/* Precision Chamber Grid */}
                <div 
                  className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Top Corner Stage Indicator */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs select-none">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-slate-800 dark:text-slate-200">
                    Stage {activeStage} of 5: {stages[activeStage - 1]?.badge.split(' · ')[1]}
                  </span>
                </div>

                {/* Top Right Specimen Notice */}
                <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-semibold select-none">
                  <Sparkles className="w-3 h-3 text-sky-500" />
                  <span>Verification Chamber</span>
                </div>

                {/* 3D Scene Canvas */}
                <WebGLErrorBoundary fallback={<StoryFallback currentStage={activeStage} onSelectStage={handleStageSelect} reason="WebGL context error" />}>
                  <Canvas
                    camera={{ position: [0, 0, 4.3], fov: 38 }}
                    gl={{
                      antialias: true,
                      alpha: true,
                      powerPreference: 'high-performance',
                    }}
                    className="w-full h-full"
                  >
                    <DocumentVerification3D currentStage={activeStage} />
                  </Canvas>
                </WebGLErrorBoundary>

                {/* Bottom Overlay Hint */}
                <div className="absolute bottom-3 inset-x-4 z-20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-800/50 pt-2 select-none">
                  <span>Precision Chamber • Pointer Responsive</span>
                  <span className="font-mono text-[10px]">Specimen Engine v1.0</span>
                </div>
              </div>

              {/* Caption Disclaimer */}
              <p className="text-center text-[11px] text-slate-400">
                Visual demonstration of pipeline stages. All specimens and results are synthetic simulations.
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
