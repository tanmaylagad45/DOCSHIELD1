import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { InteractiveDocumentStory } from '../components/landing/story/InteractiveDocumentStory';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CoreFeaturesSection } from '../components/landing/CoreFeaturesSection';
import { ResponsibleSecuritySection } from '../components/landing/ResponsibleSecuritySection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <LandingNavbar />
      <main>
        {/* First Viewport: Cinematic 3D Verification Chamber & Editorial Hero */}
        <LandingHero />

        {/* Scroll-Driven Storytelling: 5 Progressive Stages */}
        <InteractiveDocumentStory />

        {/* Section 1: How DocShield Works (Submit → Extract → Assess → Review) */}
        <HowItWorksSection />

        {/* Section 2: Core Capabilities (Intelligence, Integrity, Compliance) */}
        <CoreFeaturesSection />

        {/* Section 3: Responsible Verification (Transparency & Distinction Matrix) */}
        <ResponsibleSecuritySection />
      </main>

      {/* Final CTA ('Bring clarity to document verification.') & Minimal Footer */}
      <LandingFooter />
    </div>
  );
};
