import {
  Navbar,
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeatureBento,
  HowItWorksSection,
  AITechSection,
  SecuritySection,
  FAQSection,
  CTABanner,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeatureBento />
        <HowItWorksSection />
        <AITechSection />
        <SecuritySection />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
