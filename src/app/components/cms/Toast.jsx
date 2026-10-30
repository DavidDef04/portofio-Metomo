"use client";
import { AnimatePresence, motion } from "framer-motion";

const DURATION_MS = 6000;

/**
 * Notification du tableau de bord : fond plein (lisible quel que soit le
 * contenu derrière), barre de couleur selon le type, fermeture manuelle et
 * barre de temps restant.
 */
export default function Toast({ toast, onClose }) {
  const success = toast?.type === "success";
  const accent = success ? "var(--teal)" : "var(--ember)";

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role={success ? "status" : "alert"}
          aria-live={success ? "polite" : "assertive"}
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-16 md:top-5 left-4 right-4 md:left-auto md:right-5 z-[60] md:w-[380px] overflow-hidden border border-border-strong shadow-2xl shadow-black/60"
          style={{ background: "var(--elevated-2)", borderRadius: "var(--radius-md)" }}
        >
          <div className="flex gap-3 p-4 pl-5 relative">
            <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} aria-hidden />
            <span
              className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs font-bold"
              style={{ background: accent, color: "var(--void)" }}
              aria-hidden
            >
              {success ? "✓" : "!"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-bone text-sm font-medium">
                {success ? "Enregistré" : "Une erreur est survenue"}
              </p>
              <p className="mt-0.5 text-silver text-sm leading-snug break-words">{toast.text}</p>
              {success && toast.showLink !== false && (
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-champagne hover:underline text-xs"
                >
                  Voir sur le site →
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="self-start -mr-1 -mt-1 w-7 h-7 flex items-center justify-center text-mist hover:text-bone transition-colors"
              aria-label="Fermer la notification"
            >
              ✕
            </button>
          </div>
          <motion.div
            className="h-0.5 origin-left"
            style={{ background: accent }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: DURATION_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const TOAST_DURATION_MS = DURATION_MS;
