"use client";
import React, { useEffect, useRef, useState } from "react";
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectSection from "./components/ProjectSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import Preloader from "./components/Preloader";
import TechSlider from "./components/TechSlider";




export default function Home() {
  const aboutRef = useRef(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500); 
    return () => clearTimeout(timer); 
  }, []);

  if (loading) return <Preloader />;

  return (
    <main className="flex min-h-screen flex-col bg-black overflow-hidden">
      <NavBar aboutSectionRef={aboutRef} />
      <div className="container mx-auto py-2 px-12 md:px-16 lg:px-20 overflow-hidden">
        <HeroSection />
        <AchievementsSection />
        <AboutSection ref={aboutRef} />
        <ProjectSection />
        {/* <TechSlider /> */}
        <EmailSection />
        {/* <ScrollToTopButton/> */}
      </div>
      
      <Footer />
    </main>
  );
}
