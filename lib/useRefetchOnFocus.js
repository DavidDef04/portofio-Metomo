"use client";
import { useEffect } from "react";

/** Recharge les données quand l'utilisateur revient sur l'onglet (ex. après édition CMS) */
export function useRefetchOnFocus(refetch) {
  useEffect(() => {
    const run = () => refetch();
    run();
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };
    window.addEventListener("focus", run);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", run);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refetch]);
}
