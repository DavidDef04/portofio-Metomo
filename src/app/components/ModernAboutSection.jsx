"use client";
import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./ui/SectionHeader";
import AmbientBackground from "./ui/AmbientBackground";
import { ease } from "@/lib/motion";
import { whatsappLink } from "@/config/contact";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";

const ModernAboutSection = forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState("skills");

  const [certifications, setCertifications] = useState([]);
  const [aboutMeta, setAboutMeta] = useState(DEFAULT_SITE_CONTENT.about);
  const [experiences, setExperiences] = useState(DEFAULT_SITE_CONTENT.experiences);
  const [education, setEducation] = useState(DEFAULT_SITE_CONTENT.education);

  const tabs = [
    { id: "skills", label: "Stack" },
    { id: "experience", label: "Parcours" },
    { id: "education", label: "Formation" },
    { id: "certifications", label: "Certifications" },
  ];

  const loadAboutContent = useCallback(() => {
    fetch("/api/certifications", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCertifications(d.certifications);
      })
      .catch(() => {});

    fetch("/api/site-content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        if (d.about) setAboutMeta(d.about);
        if (d.experiences?.length) setExperiences(d.experiences);
        if (d.education?.length) setEducation(d.education);
      })
      .catch(() => {});
  }, []);

  useRefetchOnFocus(loadAboutContent);

  const skills = {
    development: [
      { name: "PHP / Laravel", level: 80 },
      { name: "Python / Django", level: 75 },
      { name: "JavaScript", level: 80 },
      { name: "React / Next.js", level: 75 },
      { name: "SQL & bases de données", level: 78 },
      { name: "HTML / CSS / Tailwind", level: 85 },
    ],
    delivery: [
      { name: "SEO & référencement", level: 75 },
      { name: "Optimisation de sites", level: 72 },
      { name: "Déploiement", level: 78 },
      { name: "FileZilla / FTP", level: 80 },
      { name: "n8n (automatisations)", level: 70 },
      { name: "IA & Notion (productivité)", level: 75 },
    ],
    systems: [
      { name: "Windows Server", level: 72 },
      { name: "Linux", level: 65 },
      { name: "Git", level: 80 },
      { name: "Administration système", level: 68 },
    ],
    cybersecurity: [
      { name: "Bases du pentesting", level: 60 },
      { name: "Sensibilisation sécurité", level: 65 },
      { name: "Sécurité réseau (notions)", level: 58 },
    ],
  };

  const SkillBar = ({ skill }) => (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="text-bone text-sm font-medium">{skill.name}</span>
        <span className="text-mist text-xs tabular-nums">{skill.level}%</span>
      </div>
      <div className="h-px bg-elevated-2 relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-champagne"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: ease.outExpo }}
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "skills":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Développement", items: skills.development },
              { title: "Mise en ligne & SEO", items: skills.delivery },
              { title: "Systèmes", items: skills.systems },
              {
                title: "Cybersécurité (parcours)",
                items: skills.cybersecurity,
              },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="label-mono mb-6">{group.title}</h3>
                {group.items.map((s) => (
                  <SkillBar key={s.name} skill={s} />
                ))}
              </div>
            ))}
          </div>
        );
      case "experience":
        return (
          <div className="space-y-px bg-border">
            {experiences.map((exp) => (
              <div
                key={exp.id || exp.title}
                className="surface-card !rounded-none p-8 hover:bg-elevated/60 transition-colors"
              >
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-bone font-display text-h3 font-semibold">
                      {exp.title}
                    </h3>
                    <p className="text-champagne text-sm mt-1">{exp.company}</p>
                  </div>
                  <span className="label-mono !text-[0.6rem]">{exp.period}</span>
                </div>
                <p className="text-mist text-sm mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 border border-border text-mist text-xs"
                      style={{ borderRadius: "var(--radius-cut)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case "education":
        return (
          <div className="space-y-px bg-border">
            {education.map((edu) => (
              <div key={edu.id || edu.degree} className="surface-card !rounded-none p-8">
                <h3 className="text-bone font-medium mb-1">{edu.degree}</h3>
                <p className="text-champagne text-sm">{edu.school}</p>
                <p className="label-mono !text-[0.6rem] mt-2 mb-3">{edu.period}</p>
                <p className="text-mist text-sm">{edu.description}</p>
              </div>
            ))}
          </div>
        );
      case "certifications":
        return certifications.length === 0 ? (
          <p className="text-mist text-sm text-center py-8">
            Aucune certification publiée pour le moment.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-px bg-border">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="surface-card !rounded-none p-8 border-l-2 border-l-champagne/40"
              >
                <h3 className="text-bone font-medium mb-2">{cert.name}</h3>
                <p className="text-champagne text-sm">{cert.issuer}</p>
                <p className="label-mono !text-[0.6rem] mt-2 mb-3">{cert.date}</p>
                <p className="text-mist text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={ref} id="about" className="section-shell relative">
      <AmbientBackground />
      <SectionHeader
        label={aboutMeta.sectionLabel}
        title={aboutMeta.sectionTitle}
        titleAccent={aboutMeta.sectionTitleAccent}
        description={aboutMeta.sectionDescription}
      />

      <div className="flex flex-wrap gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm transition-all duration-300 border ${
              activeTab === tab.id
                ? "bg-champagne text-void border-champagne"
                : "bg-transparent text-mist border-border hover:text-bone hover:border-border-strong"
            }`}
            style={{ borderRadius: "var(--radius-cut)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: ease.outExpo }}
          className="surface-card p-8 md:p-12"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <div className="mt-14 flex flex-wrap justify-center gap-4">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium btn-premium--primary"
        >
          Écrire sur WhatsApp
        </a>
        <a href="#contact" className="btn-premium btn-premium--ghost">
          Autres moyens de contact
        </a>
      </div>
    </section>
  );
});

ModernAboutSection.displayName = "ModernAboutSection";
export default ModernAboutSection;
