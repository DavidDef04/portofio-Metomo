"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

type PreloaderProps = {
  children: ReactNode;
};

const Preloader = ({ children }: PreloaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesToLoad] = useState([
    "/images/projects/logo-maisoft.png",
    "/images/projects/eyeson.jpg",
    "/images/projects/logo-getsmarter.png",
    "/images/projects/portfolio.png",
    "/images/Profil.jpg",
    "/images/aboutSection.jpg",
  ]);

  useEffect(() => {
    let loadedCount = 0;

    const checkImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === imagesToLoad.length) {
        setTimeout(() => {
          setIsLoaded(true);
        }, 3000);
      }
    };

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkImageLoad;
      img.onerror = checkImageLoad;
    });
  }, [imagesToLoad]);

  if (!isLoaded) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black z-[9999] overflow-hidden"
        role="status"
        aria-busy={Boolean(!isLoaded)}
      >
        <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
          <motion.div
            initial={{ width: "50px", height: "50px", borderRadius: "50%" }}
            animate={{
              width: "150px",
              height: "150px",
              backgroundColor: [
                "#ec4899",
                "#8b5cf6",
                "#3b82f6",
                "#34d399",
                "#f59e0b",
                "#10b981",
                "#6b21a8",
                "#6366f1",
                "#ec4899",
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="absolute rounded-full border-4 border-transparent"
          />

          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-4 border-t-transparent border-b-transparent border-l-transparent border-r-[#ec4899]"
          />

          <motion.div
            initial={{ width: "50px", height: "50px", borderRadius: "50%" }}
            animate={{
              width: ["150px", "200px", "300px", "400px"],
              height: ["150px", "200px", "300px", "400px"],
              backgroundColor: [
                "#34d399",
                "#3b82f6",
                "#8b5cf6",
                "#ec4899",
                "#34d399",
              ],
            }}
            transition={{
              duration: 7,
              delay: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            className="absolute rounded-full border-4 border-transparent opacity-40 max-w-full max-h-full sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px]"
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Preloader;
