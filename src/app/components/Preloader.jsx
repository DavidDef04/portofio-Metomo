"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesToLoad, setImagesToLoad] = useState([
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
        setIsLoaded(true); 
      }
    };

    // Crée un tableau d'éléments Image et attend que chaque image soit chargée
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkImageLoad; 
    });
  }, [imagesToLoad]); 

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
        <div className="relative flex items-center justify-center">
          {/* Cercle principal qui change de couleur et s'agrandit */}
          <motion.div
            initial={{ width: "50px", height: "50px", borderRadius: "50%" }}
            animate={{
              width: "300px",
              height: "300px",
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
              duration: 4, 
              repeat: Infinity, 
              repeatType: "loop", 
              ease: "easeInOut", 
            }}
            className="absolute border-4 border-transparent"
          />

          {/* Cercle tournant autour du cercle principal (loader circulaire) */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.7, 
              repeat: Infinity, 
              ease: "linear", 
            }}
            className="absolute w-96 h-96 rounded-full border-4 border-t-transparent border-b-transparent border-l-transparent border-r-[#ec4899]"
          />

          {/* Cercle supplémentaire en arrière-plan pour ajouter du dynamisme */}
          <motion.div
            initial={{ width: "50px", height: "50px", borderRadius: "50%" }}
            animate={{
              width: "400px", 
              height: "400px", 
              backgroundColor: [
                "#34d399", 
                "#3b82f6", 
                "#8b5cf6", 
                "#ec4899", 
                "#34d399", 
              ], 
            }}
            transition={{
              duration: 4, 
              delay: 1, 
              repeat: Infinity, 
              repeatType: "loop", 
              ease: "easeInOut", 
            }}
            className="absolute border-4 border-transparent opacity-40" 
          />
        </div>
      </div>
    );
  }

  // Retourner le contenu principal du site une fois le préchargeur disparu
  return (
    <main className="flex min-h-screen flex-col bg-[#121212] overflow-hidden">
      <div className="container mx-auto py-2 px-12 overflow-hidden">
        <h1 className="text-white">Bienvenue sur mon portfolio !</h1>
      </div>
    </main>
  );
};

export default Preloader;
