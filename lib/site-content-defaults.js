/** Valeurs par défaut si le CMS n'a pas encore de fichier ou champ manquant */
export const DEFAULT_SITE_CONTENT = {
  hero: {
    eyebrow: "Douala, Cameroun — Développeur web chez ALC Digital",
    nameLine1: "David René",
    nameHighlight: "METOMO",
    roles: [
      "Développeur full-stack",
      "Sites web, SEO & déploiement",
      "Cybersécurité — formation & projets",
    ],
    intro:
      "Je construis des produits numériques où technologie, performance et design travaillent ensemble. Applications web, automatisations IA et expériences modernes conçues pour être rapides, fluides et mémorables.",
    cvUrl: "/cv/David_Rene_Metomo_CV.pdf",
    cvLabel: "Télécharger le CV",
    whatsappCta: "Discuter sur WhatsApp",
    statusLabel: "En ce moment",
    statusText: "Sites web · SEO · Déploiement · n8n · IA",
    social: {
      github: "https://github.com/DavidDef04",
      linkedin:
        "https://www.linkedin.com/in/david-ren%C3%A9-metomo-elogo-5b0432314",
      email: "mailto:metomo442@gmail.com",
    },
  },
  about: {
    sectionLabel: "Expertise",
    sectionTitle: "Ce que je fais",
    sectionTitleAccent: "au quotidien",
    sectionDescription:
      "Développeur full-stack orienté sites web concrets : code, SEO, mise en ligne et automatisation. Pas de promesses vides — uniquement ce que je pratique réellement.",
  },
  experiences: [
    {
      id: "exp-alc",
      title: "Développeur Web",
      company: "ALC Digital — Douala",
      period: "2025 — Présent",
      description:
        "Création et maintenance de sites web : développement, SEO, optimisation, référencement et déploiement (FileZilla). Automatisation des formulaires avec n8n et usage de l'IA (Notion) pour gagner en productivité.",
      technologies: ["Sites web", "SEO", "Déploiement", "n8n", "IA"],
      order: 10,
      visible: true,
    },
    {
      id: "exp-cyber-freelance",
      title: "Cybersécurité — Freelance",
      company: "Missions ponctuelles",
      period: "2024 — Présent",
      description:
        "Petits audits, tests et sensibilisation selon les besoins des clients — en complément de mon activité principale de développement.",
      technologies: ["Linux", "Tests", "Sensibilisation"],
      order: 20,
      visible: true,
    },
    {
      id: "exp-maisoft",
      title: "Stagiaire Cybersécurité",
      company: "Maisoft Group — Douala",
      period: "2024 — 2025",
      description:
        "Stage orienté cybersécurité et développement web en environnement professionnel.",
      technologies: ["Web", "Cybersécurité"],
      order: 30,
      visible: true,
    },
  ],
  education: [
    {
      id: "edu-getsmarter",
      degree: "Diplôme de qualification en cybersécurité",
      school: "GETSMARTER Group — Douala",
      period: "2023 — 2025",
      description:
        "Formation en sécurité des systèmes, pentesting et développement — base solide, en progression continue sur le terrain.",
      order: 10,
      visible: true,
    },
    {
      id: "edu-auto",
      degree: "Formation continue & projets personnels",
      school: "Autodidacte",
      period: "2024 — Présent",
      description:
        "Pratique régulière du full-stack (Django, Laravel, PHP, JS) et des outils web du quotidien.",
      order: 20,
      visible: true,
    },
  ],
};
