/**
 * Suivi des actions des visiteurs via Google Analytics 4 (gtag déjà chargé
 * dans le layout). Ces noms d'événements sont relus par l'onglet
 * « Statistiques » du tableau de bord (api/cms/analytics).
 */
export const TRACKED_EVENTS = {
  cv_download_fr: "CV français téléchargé",
  cv_download_en: "CV anglais téléchargé",
  contact_whatsapp: "Clic WhatsApp",
  contact_email: "Clic e-mail",
  contact_form_sent: "Formulaire envoyé",
  project_visit: "Visite d'un site projet",
  project_code: "Ouverture du code d'un projet",
  social_click: "Clic GitHub / LinkedIn",
  language_switch: "Changement de langue",
};

export function track(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    /* le suivi ne doit jamais casser la page */
  }
}
