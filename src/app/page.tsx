"use client";
import React, { useRef } from "react";
import PremiumNav from "./components/PremiumNav";
import ModernHeroSection from "./components/ModernHeroSection";
import ModernAboutSection from "./components/ModernAboutSection";
import ModernProjectSection from "./components/ModernProjectSection";
import ModernEmailSection from "./components/ModernEmailSection";
import ModernFooter from "./components/ModernFooter";
import AchievementsSection from "./components/AchievementsSection";
import ModernPreloader from "./components/ModernPreloader";
import ModernScrollToTopButton from "./components/ModernScrollToTopButton";
import WhatsAppButton from "./components/WhatsAppButton";

export default function Home() {
  const aboutRef = useRef(null);

  return (
    <ModernPreloader>
      <main className="relative min-h-screen bg-void overflow-x-hidden">
        <PremiumNav />
        <ModernHeroSection />
        <AchievementsSection />
        <ModernAboutSection ref={aboutRef} />
        <ModernProjectSection />
        <ModernEmailSection />
        <ModernScrollToTopButton />
        <WhatsAppButton />
        <ModernFooter />
      </main>
    </ModernPreloader>
  );
}
