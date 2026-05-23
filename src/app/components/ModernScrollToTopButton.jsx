"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModernScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 border border-border-strong bg-surface/90 backdrop-blur text-bone hover:border-champagne hover:text-champagne transition-colors max-md:bottom-24"
          style={{ borderRadius: "var(--radius-cut)" }}
          aria-label="Retour en haut"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ModernScrollToTopButton;
