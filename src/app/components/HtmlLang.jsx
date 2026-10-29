"use client";
import { useEffect } from "react";

/** Aligne l'attribut lang de <html> sur la langue de la page. */
export default function HtmlLang({ lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
