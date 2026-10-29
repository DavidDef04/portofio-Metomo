"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";

/**
 * Écran d'intro court, posé AU-DESSUS du contenu.
 * Le contenu est rendu dès le départ (visible pour Google et les aperçus de
 * liens) ; l'intro disparaît après ~0,9 s, par un minuteur et non par
 * requestAnimationFrame (mis en pause dans les onglets en arrière-plan).
 * Elle n'est montrée qu'une fois par session.
 */
const INTRO_MS = 900;
const SESSION_KEY = "metomo-intro-seen";

const ModernPreloader = ({ children }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* stockage indisponible : on montre l'intro */
    }
    if (seen) {
      setShowIntro(false);
      return;
    }
    const t = setTimeout(() => setShowIntro(false), INTRO_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="preloader"
            aria-hidden
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: ease.outExpo }}
          >
            <div className="font-display text-4xl md:text-5xl font-bold text-bone tracking-tight mb-8">
              M<span className="text-champagne">.</span>
            </div>
            <div className="w-48 h-px bg-elevated-2 overflow-hidden">
              <motion.div
                className="h-full bg-champagne"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: INTRO_MS / 1000, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default ModernPreloader;
