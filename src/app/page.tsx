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
import ScrollToTopButton from "./components/ScrollToTopButton";
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



  return (
    <Preloader>
    <main className="flex min-h-screen flex-col bg-black overflow-hidden">
      <NavBar aboutSectionRef={aboutRef} />
      <div className="w-full px-2 py-2 mx-0 sm:px-4 sm:py-3 sm:mx-2 md:px-6 lg:px-20 xl:px-25 overflow-hidden">
        <HeroSection />
        <AchievementsSection />
        <AboutSection ref={aboutRef} />
        <ProjectSection />
        {/* <TechSlider /> */}
        <EmailSection />
        <ScrollToTopButton/>
      </div>
      
      <Footer />
    </main>
    </Preloader>
  );
}
