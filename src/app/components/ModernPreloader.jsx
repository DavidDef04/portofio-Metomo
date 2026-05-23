"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";

const ModernPreloader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => setLoading(false), 350);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: ease.outExpo }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl font-bold text-bone tracking-tight mb-8"
            >
              M<span className="text-champagne">.</span>
            </motion.div>
            <div className="w-48 h-px bg-elevated-2 overflow-hidden">
              <div
                className="h-full bg-champagne transition-[width] duration-75 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="label-mono mt-6 !text-[0.6rem] text-mist">
              Chargement de l&apos;expérience
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: ease.outExpo }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default ModernPreloader;
