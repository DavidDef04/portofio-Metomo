"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";

/**
 * Écoute les clics sur la page publique et envoie un événement pour les
 * actions qui comptent : téléchargement de CV, contact, visite d'un projet,
 * réseaux, changement de langue. Aucun composant n'a besoin d'être modifié.
 */
export default function Tracker({ lang }) {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const where =
        a.closest("section")?.id ||
        (a.closest("footer") ? "footer" : a.closest("header") ? "nav" : "other");
      const base = { page_lang: lang, link_url: a.href, location: where };

      if (a.closest(".lang-switch")) {
        const to = a.getAttribute("hreflang");
        if (to && to !== lang) track("language_switch", { ...base, to_lang: to });
        return;
      }
      if (/\.pdf($|\?)/i.test(href)) {
        const isEn = /resume|_en_|\/en\//i.test(href);
        track(isEn ? "cv_download_en" : "cv_download_fr", base);
        return;
      }
      const serviceCard = a.closest("#services article");
      if (serviceCard) {
        track("service_quote", { ...base, service: serviceCard.dataset.service || "" });
        return;
      }
      if (/wa\.me|whatsapp/i.test(href)) {
        track("contact_whatsapp", base);
        return;
      }
      if (href.startsWith("mailto:")) {
        track("contact_email", base);
        return;
      }
      const inProjects = !!a.closest("#projects");
      if (inProjects && /^https?:/i.test(href)) {
        const title = a.closest("article")?.querySelector("h3, h4")?.textContent?.trim() || "";
        const isCode = /github\.com/i.test(href);
        // « Tout mon GitHub » en bas de section : un clic réseau, pas un projet
        if (isCode && !a.closest("article")) {
          track("social_click", { ...base, network: "github" });
          return;
        }
        track(isCode ? "project_code" : "project_visit", { ...base, project: title });
        return;
      }
      if (/github\.com|linkedin\.com/i.test(href)) {
        track("social_click", { ...base, network: /linkedin/i.test(href) ? "linkedin" : "github" });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [lang]);

  return null;
}
