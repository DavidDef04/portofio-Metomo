"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Fenêtre de confirmation aux couleurs du tableau de bord (remplace
 * window.confirm). Usage : const [confirm, dialog] = useConfirm();
 * if (!(await confirm({ title, message }))) return;  … et rendre {dialog}.
 */
export function useConfirm() {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setState(opts);
      }),
    []
  );

  const close = useCallback((value) => {
    resolver.current?.(value);
    resolver.current = null;
    setState(null);
  }, []);

  const dialog = <ConfirmDialog state={state} onClose={close} />;
  return [confirm, dialog];
}

function ConfirmDialog({ state, onClose }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!state) return;
    confirmRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state, onClose]);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(false)}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            className="w-full max-w-sm border border-border-strong shadow-2xl shadow-black/60 p-6"
            style={{ background: "var(--elevated-2)", borderRadius: "var(--radius-md)" }}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-title" className="font-display text-bone text-lg mb-2">
              {state.title || "Confirmer"}
            </p>
            {state.message && (
              <p id="confirm-message" className="text-silver text-sm leading-relaxed mb-6">
                {state.message}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" className="btn-premium btn-premium--ghost !py-2.5 !px-4" onClick={() => onClose(false)}>
                Annuler
              </button>
              <button
                ref={confirmRef}
                type="button"
                className="btn-premium !py-2.5 !px-4 text-void"
                style={{ background: state.danger === false ? "var(--champagne)" : "var(--ember)" }}
                onClick={() => onClose(true)}
              >
                {state.confirmLabel || "Supprimer"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
