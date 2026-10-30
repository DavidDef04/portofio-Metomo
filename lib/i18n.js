/**
 * Site bilingue : français (par défaut, « / ») et anglais (« /en »).
 *
 * - DICT : textes de l'interface.
 * - localize(obj, lang) : pour le contenu du CMS, chaque champ peut avoir une
 *   variante anglaise suffixée « _en » (ex. description_en). En anglais, la
 *   variante remplace le champ français quand elle est renseignée.
 */

export const LANGS = ["fr", "en"];
export const DEFAULT_LANG = "fr";

export function normalizeLang(value) {
  return value === "en" ? "en" : "fr";
}

export function homePath(lang) {
  return lang === "en" ? "/en" : "/";
}

function hasValue(v) {
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === "string" ? v.trim() !== "" : v != null;
}

/** Remplace chaque champ X par X_en (si renseigné) quand lang === "en". */
export function localize(obj, lang) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  if (lang !== "en") return obj;
  const out = { ...obj };
  for (const [key, value] of Object.entries(obj)) {
    if (!key.endsWith("_en")) continue;
    const base = key.slice(0, -3);
    if (hasValue(value)) out[base] = value;
  }
  return out;
}

export function localizeList(list, lang) {
  return Array.isArray(list) ? list.map((item) => localize(item, lang)) : list;
}

const CATEGORY_EN = {
  Web: "Web",
  Mobile: "Mobile",
  "Cybersécurité": "Cybersecurity",
  IA: "AI",
};

export function categoryLabel(category, lang) {
  if (lang !== "en") return category;
  return CATEGORY_EN[category] || category;
}

export const DICT = {
  fr: {
    meta: {
      title: "David René METOMO — Développeur full-stack & cybersécurité",
      description:
        "Développeur full-stack et junior en cybersécurité à Douala. Plateformes SaaS, sites web, API (Next.js, NestJS, Laravel, Django), SEO, déploiement. Certifié Google Cybersecurity.",
      ogDescription:
        "Développeur full-stack qui pense sécurité : plateformes SaaS, sites web, API et déploiement. Basé à Douala.",
    },
    nav: {
      home: "Accueil",
      projects: "Travaux",
      services: "Services",
      achievements: "Repères",
      about: "Expertise",
      contact: "Contact",
      openMenu: "Ouvrir le menu",
      closeMenu: "Fermer le menu",
      language: "Langue",
    },
    hero: {
      abroad: "Hors du Cameroun ? Écrivez-moi :",
      otherCv: "English resume",
      scroll: "Voir les projets",
      photoAlt: "Développeur full-stack",
    },
    projects: {
      label: "Réalisations",
      title: "Projets",
      accent: "sélectionnés",
      description:
        "Des plateformes complètes en production, de l'API au déploiement, et des travaux pratiques en cybersécurité.",
      visit: "Voir le site",
      code: "Code source",
      privateCode: "Code privé (projet client)",
      privateRepo: "Dépôt privé",
      archives: "Archives",
      others: "Autres travaux",
      all: "Tous",
      filter: "Filtrer par catégorie",
      showAll: (n) => `Voir les ${n} travaux`,
      showLess: "Réduire",
      empty: "Les projets arrivent bientôt.",
      github: "Tout mon GitHub",
      preview: (t) => `Aperçu du projet ${t}`,
      open: (t) => `Ouvrir ${t}`,
      codeOf: (t) => `Code source de ${t}`,
      liveOf: (t) => `Voir ${t} en ligne`,
    },
    services: {
      label: "Services",
      title: "Ce que je peux",
      accent: "faire pour vous",
      description:
        "Du site vitrine à la plateforme SaaS, avec la sécurité intégrée dès le départ. Chaque projet commence par un échange gratuit pour cadrer votre besoin.",
      quote: "Demander un devis",
      quoteMessage: (s) => `Bonjour David, je souhaite un devis pour : ${s}.`,
      ctaTitle: "Un projet en tête ?",
      ctaText: "Décrivez-le en quelques lignes : je vous réponds avec une proposition adaptée, sans engagement.",
      ctaWhatsapp: "Discuter sur WhatsApp",
      ctaEmail: "Écrire par e-mail",
      emailSubject: "Demande de devis",
    },
    achievements: {
      label: "En chiffres",
      title: "Le parcours",
      accent: "en quelques repères",
      description: "Ce que j'ai livré, ce que j'ai validé, et depuis quand.",
      items: [
        { value: "4", label: "Plateformes en production", detail: "Caisse SaaS, formation en ligne, e-commerce, outil IA" },
        { value: "Google", label: "Certifié Cybersecurity", detail: "Certificat professionnel, 2026" },
        { value: "2023", label: "Début du parcours", detail: "Développement et sécurité, en continu depuis" },
      ],
    },
    about: {
      tabs: { skills: "Stack", experience: "Parcours", education: "Formation", certifications: "Certifications" },
      noCerts: "Aucune certification publiée pour le moment.",
      verify: "Vérifier le certificat →",
      whatsapp: "Écrire sur WhatsApp",
      otherContact: "Autres moyens de contact",
      skillGroups: [
        {
          title: "Développement",
          items: ["PHP / Laravel", "Python / Django", "JavaScript / TypeScript", "React / Next.js", "NestJS", "Prisma", "Spring Boot", "Astro", "HTML / CSS / Tailwind", "SQL · PostgreSQL · MySQL"],
        },
        {
          title: "Mise en ligne & automatisation",
          items: ["Docker", "Vercel · Coolify · VPS", "Git · GitHub Actions", "SEO & référencement", "n8n", "IA générative (API LLM)"],
        },
        {
          title: "Cybersécurité",
          items: ["Linux & Bash", "Python pour l'automatisation", "SIEM (Splunk, Chronicle)", "Analyse réseau (Wireshark, tcpdump)", "Détection d'intrusion (Suricata)", "Gestion des risques (NIST CSF)", "Réponse aux incidents", "Sensibilisation au phishing"],
        },
        { title: "Systèmes", items: ["Windows Server", "Administration système", "Réseaux (TCP/IP)"] },
      ],
    },
    contact: {
      label: "Contact",
      title: "Parlons de",
      accent: "votre projet",
      description:
        "WhatsApp pour un échange rapide depuis le Cameroun, e-mail pour les clients à l'international. Je réponds sur les deux canaux.",
      whatsappTag: "Cameroun · WhatsApp",
      emailTag: "International · E-mail",
      emailSubject: "Projet / collaboration",
      formIntro: "Vous préférez écrire directement ici ? Le formulaire m'envoie votre message par e-mail.",
      openForm: "Écrire un message",
      myNumber: (n) => `Mon numéro : ${n} — indiquez le vôtre pour être rappelé`,
      email: "Votre e-mail *",
      emailPh: "vous@entreprise.com",
      phone: "Votre téléphone / WhatsApp (facultatif)",
      phonePh: "+237 6XX XXX XXX ou +33 6 XX XX XX XX",
      subject: "Sujet *",
      subjectPh: "Site web, mission…",
      message: "Message *",
      messagePh: "Votre message…",
      send: "Envoyer le message",
      captchaHint: "Cochez la vérification anti-spam pour activer l'envoi.",
      sendError: "Erreur lors de l'envoi.",
      networkError: "Erreur de connexion.",
    },
    modal: {
      validating: "Vérification de sécurité…",
      sending: "Envoi du message…",
      success: "Message envoyé avec succès",
      error: "Échec de l'envoi",
      errorTitle: "Erreur",
      sendingTitle: "Envoi en cours",
    },
    footer: {
      tagline: "Développeur full-stack et cybersécurité : plateformes SaaS, sites web, API et déploiement. Basé à Douala.",
      whatsapp: "Contacter sur WhatsApp →",
      navigation: "Navigation",
      footerNav: "Navigation pied de page",
      stack: "Stack actuelle",
      rights: "Tous droits réservés.",
      location: "Douala, Cameroun",
    },
    misc: {
      whatsappAria: "Contacter sur WhatsApp",
      backToTop: "Retour en haut",
      whatsappMessage: "Bonjour David, je souhaite échanger avec vous sur un projet ou une collaboration.",
    },
  },

  en: {
    meta: {
      title: "David René METOMO — Full-Stack Developer & Cybersecurity",
      description:
        "Full-stack developer with a cybersecurity background, based in Douala, Cameroon. SaaS platforms, websites, APIs (Next.js, NestJS, Laravel, Django), SEO, deployment. Google Cybersecurity certified.",
      ogDescription:
        "Security-minded full-stack developer: SaaS platforms, websites, APIs and deployment. Based in Douala, Cameroon.",
    },
    nav: {
      home: "Home",
      projects: "Work",
      services: "Services",
      achievements: "Milestones",
      about: "Expertise",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      language: "Language",
    },
    hero: {
      abroad: "Outside Cameroon? Email me:",
      otherCv: "CV en français",
      scroll: "See the work",
      photoAlt: "Full-stack developer",
    },
    projects: {
      label: "Work",
      title: "Selected",
      accent: "projects",
      description:
        "Complete platforms in production, from API to deployment, plus hands-on cybersecurity work.",
      visit: "Visit site",
      code: "Source code",
      privateCode: "Private code (client project)",
      privateRepo: "Private repository",
      archives: "Archive",
      others: "Other work",
      all: "All",
      filter: "Filter by category",
      showAll: (n) => `See all ${n} projects`,
      showLess: "Show less",
      empty: "Projects coming soon.",
      github: "All my GitHub",
      preview: (t) => `Preview of ${t}`,
      open: (t) => `Open ${t}`,
      codeOf: (t) => `Source code of ${t}`,
      liveOf: (t) => `Visit ${t}`,
    },
    services: {
      label: "Services",
      title: "What I can",
      accent: "do for you",
      description:
        "From business websites to SaaS platforms, with security built in from day one. Every project starts with a free call to scope your needs.",
      quote: "Request a quote",
      quoteMessage: (s) => `Hello David, I'd like a quote for: ${s}.`,
      ctaTitle: "Have a project in mind?",
      ctaText: "Describe it in a few lines and I'll get back to you with a tailored proposal, no strings attached.",
      ctaWhatsapp: "Chat on WhatsApp",
      ctaEmail: "Send an email",
      emailSubject: "Quote request",
    },
    achievements: {
      label: "Milestones",
      title: "The journey",
      accent: "at a glance",
      description: "What I've shipped, what I've earned, and since when.",
      items: [
        { value: "4", label: "Platforms in production", detail: "SaaS point of sale, e-learning, e-commerce, AI tool" },
        { value: "Google", label: "Cybersecurity certified", detail: "Professional Certificate, 2026" },
        { value: "2023", label: "Started the journey", detail: "Development and security, ever since" },
      ],
    },
    about: {
      tabs: { skills: "Stack", experience: "Experience", education: "Education", certifications: "Certifications" },
      noCerts: "No certifications published yet.",
      verify: "Verify certificate →",
      whatsapp: "Message on WhatsApp",
      otherContact: "Other ways to reach me",
      skillGroups: [
        {
          title: "Development",
          items: ["PHP / Laravel", "Python / Django", "JavaScript / TypeScript", "React / Next.js", "NestJS", "Prisma", "Spring Boot", "Astro", "HTML / CSS / Tailwind", "SQL · PostgreSQL · MySQL"],
        },
        {
          title: "Deployment & automation",
          items: ["Docker", "Vercel · Coolify · VPS", "Git · GitHub Actions", "SEO", "n8n", "Generative AI (LLM APIs)"],
        },
        {
          title: "Cybersecurity",
          items: ["Linux & Bash", "Python automation", "SIEM (Splunk, Chronicle)", "Network analysis (Wireshark, tcpdump)", "Intrusion detection (Suricata)", "Risk management (NIST CSF)", "Incident response", "Phishing awareness"],
        },
        { title: "Systems", items: ["Windows Server", "System administration", "Networking (TCP/IP)"] },
      ],
    },
    contact: {
      label: "Contact",
      title: "Let's talk about",
      accent: "your project",
      description:
        "WhatsApp for a quick chat from Cameroon, email for international clients. I answer on both.",
      whatsappTag: "Cameroon · WhatsApp",
      emailTag: "International · Email",
      emailSubject: "Project / collaboration",
      formIntro: "Prefer to write here? The form sends me your message by email.",
      openForm: "Write a message",
      myNumber: (n) => `My number: ${n} — leave yours if you'd like a call back`,
      email: "Your email *",
      emailPh: "you@company.com",
      phone: "Your phone / WhatsApp (optional)",
      phonePh: "+1 555 000 0000 or +33 6 XX XX XX XX",
      subject: "Subject *",
      subjectPh: "Website, project…",
      message: "Message *",
      messagePh: "Your message…",
      send: "Send message",
      captchaHint: "Complete the anti-spam check to enable sending.",
      sendError: "Could not send the message.",
      networkError: "Connection error.",
    },
    modal: {
      validating: "Security check…",
      sending: "Sending your message…",
      success: "Message sent",
      error: "Sending failed",
      errorTitle: "Error",
      sendingTitle: "Sending",
    },
    footer: {
      tagline: "Full-stack developer and cybersecurity: SaaS platforms, websites, APIs and deployment. Based in Douala, Cameroon.",
      whatsapp: "Message on WhatsApp →",
      navigation: "Navigation",
      footerNav: "Footer navigation",
      stack: "Current stack",
      rights: "All rights reserved.",
      location: "Douala, Cameroon",
    },
    misc: {
      whatsappAria: "Contact on WhatsApp",
      backToTop: "Back to top",
      whatsappMessage: "Hello David, I'd like to talk with you about a project or a collaboration.",
    },
  },
};

export function getDict(lang) {
  return DICT[normalizeLang(lang)];
}
