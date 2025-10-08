"use client";

import {TestimonialsSection} from "@/components/landing-page/TestimonialsSection";
import { HeroSection } from "@/components/landing-page/HeroSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { HowItWorksSection } from "@/components/landing-page/HowItWorksSection";
import { FAQSection } from "@/components/landing-page/FAQSection";
import { CTASection } from "@/components/landing-page/CTASection";

export default function HomePage() {
   const scrollToSection = (href: string) => {
      const section = document.querySelector(href);
      if (section) {
         (section as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "start",
         });
      }
   };
   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
         {/* Hero Section */}
         <HeroSection scrollToSection={scrollToSection} />

         {/* Features Section */}
         <FeaturesSection />

         {/* How It Works Section */}
         <HowItWorksSection />

         {/* Testimonials Section */}
         <TestimonialsSection />

         {/* FAQ Section */}
         <FAQSection />

         {/* Final CTA Section */}
         <CTASection />
         
      </div>
   );
}
