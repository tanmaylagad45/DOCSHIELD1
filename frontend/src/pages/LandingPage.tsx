import React from 'react';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { CoreFeaturesSection } from '../components/landing/CoreFeaturesSection';
import { VerificationPreviewSection } from '../components/landing/VerificationPreviewSection';
import { ResponsibleSecuritySection } from '../components/landing/ResponsibleSecuritySection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <LandingNavbar />
      <main>
        <LandingHero />
        <HowItWorksSection />
        <CoreFeaturesSection />
        <VerificationPreviewSection />
        <ResponsibleSecuritySection />
      </main>
      <LandingFooter />
    </div>
  );
};
