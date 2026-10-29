"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getDict } from "@/lib/i18n";

const PROGRESS = { idle: 0, validating: 25, sending: 65, success: 100, error: 100 };

export default function SubmitProgressModal({ open, stage, errorMessage, lang = "fr" }) {
  const t = getDict(lang).modal;
  const step = { label: t[stage] || "", progress: PROGRESS[stage] ?? 0 };
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
              {isError ? t.errorTitle : t.sendingTitle}
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
