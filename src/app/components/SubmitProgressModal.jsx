"use client";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = {
  idle: { label: "", progress: 0 },
  validating: { label: "Vérification de sécurité…", progress: 25 },
  sending: { label: "Envoi du message…", progress: 65 },
  success: { label: "Message envoyé avec succès", progress: 100 },
  error: { label: "Échec de l'envoi", progress: 100 },
};

export default function SubmitProgressModal({ open, stage, errorMessage }) {
  const step = STEPS[stage] || STEPS.idle;
  const isError = stage === "error";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
        >
          <motion.div
            className="surface-card w-full max-w-md p-8 md:p-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <p id="submit-modal-title" className="label-mono mb-2">
              {isError ? "Erreur" : "Envoi en cours"}
            </p>
            <p
              className={`font-display text-xl mb-6 ${
                isError ? "text-ember" : stage === "success" ? "text-teal" : "text-bone"
              }`}
            >
              {isError && errorMessage ? errorMessage : step.label}
            </p>

            <div className="h-1 bg-elevated-2 overflow-hidden mb-2">
              <motion.div
                className={`h-full ${isError ? "bg-ember" : "bg-champagne"}`}
                initial={{ width: 0 }}
                animate={{ width: `${step.progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-mist text-xs text-right tabular-nums">
              {step.progress}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
