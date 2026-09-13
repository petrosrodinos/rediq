import type { FC } from "react";
import { LandingHeader } from "./components/landing-header";
import { HeroSection } from "./components/hero-section";
import { ProcessSection } from "./components/process-section";
import { FeatureShowcase } from "./components/feature-showcase";
import { PrinciplesSection } from "./components/principles-section";
import { FinalCtaSection } from "./components/final-cta-section";
import { LandingFooter } from "./components/landing-footer";

const LandingPage: FC = () => {
  return (
    <div className="flex min-h-full flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <ProcessSection />
        <FeatureShowcase />
        <PrinciplesSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
