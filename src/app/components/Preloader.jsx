"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesToLoad, setImagesToLoad] = useState([
    "/path/to/your/image1.jpg", // Remplacez par les URLs réelles de vos images
    "/path/to/your/image2.jpg",
    "/path/to/your/image3.jpg",
  ]);

  // Suivi de l'état de chargement des images
  useEffect(() => {
    let loadedCount = 0;

    // Fonction pour vérifier si l'image est chargée
    const checkImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === imagesToLoad.length) {
        setIsLoaded(true); // Tous les images sont chargées
      }
    };

    // Crée un tableau d'éléments Image et attend que chaque image soit chargée
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkImageLoad; // Appeler checkImageLoad quand l'image est chargée
    });
  }, [imagesToLoad]); // Dépendance pour réagir au changement des images à charger

  // Si les images ne sont pas chargées, afficher le préchargeur
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
                "#ec4899", // Rose
                "#8b5cf6", // Violet
                "#3b82f6", // Bleu
                "#34d399", // Vert
                "#f59e0b", // Jaune doré
                "#10b981", // Vert clair
                "#6b21a8", // Violet profond
                "#6366f1", // Bleu clair
                "#ec4899", // Retour au Rose (comme ton choix initial)
              ],
            }}
            transition={{
              duration: 7, // Durée de l'animation de 7 secondes
              repeat: Infinity, // Répète indéfiniment
              repeatType: "loop", // Boucle de l'animation
              ease: "easeInOut", // Transition douce
            }}
            className="absolute border-4 border-transparent"
          />

          {/* Cercle tournant autour du cercle principal (loader circulaire) */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.7, // Durée du tour complet (en secondes)
              repeat: Infinity, // Répète indéfiniment
              ease: "linear", // Rotation fluide continue
            }}
            className="absolute w-96 h-96 rounded-full border-4 border-t-transparent border-b-transparent border-l-transparent border-r-[#ec4899]"
          />

          {/* Cercle supplémentaire en arrière-plan pour ajouter du dynamisme */}
          <motion.div
            initial={{ width: "50px", height: "50px", borderRadius: "50%" }}
            animate={{
              width: "400px", // Ce cercle est légèrement plus grand
              height: "400px", // Agrandissement à 400px
              backgroundColor: [
                "#34d399", // Vert
                "#3b82f6", // Bleu
                "#8b5cf6", // Violet
                "#ec4899", // Rose
                "#34d399", // Retour au vert
              ], // Changement de couleur plus subtile
            }}
            transition={{
              duration: 7, // Durée de l'animation identique à celle du cercle principal
              delay: 1, // Décalage d'animation pour créer une variation
              repeat: Infinity, // Répète indéfiniment
              repeatType: "loop", // Boucle de l'animation
              ease: "easeInOut", // Transition douce
            }}
            className="absolute border-4 border-transparent opacity-40" // Cercle avec une opacité réduite pour créer un effet de fond
          />
        </div>
      </div>
    );
  }

  // Retourner le contenu principal du site une fois le préchargeur disparu
  return (
    <main className="flex min-h-screen flex-col bg-[#121212] overflow-hidden">
      <div className="container mx-auto py-2 px-12 overflow-hidden">
        {/* Le reste du contenu de la page */}
        <h1 className="text-white">Bienvenue sur mon portfolio !</h1>
        {/* Ajoutez d'autres sections ici */}
      </div>
    </main>
  );
};

export default Preloader;
