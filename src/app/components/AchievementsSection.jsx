"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Trois repères concrets, vérifiables, plutôt que des compteurs génériques.
 * À mettre à jour ici quand le parcours évolue.
 */
const MILESTONES = [
  {
    value: "4",
    label: "Plateformes en production",
    detail: "Caisse SaaS, formation en ligne, e-commerce, outil IA",
  },
  {
    value: "Google",
    label: "Certifié Cybersecurity",
    detail: "Certificat professionnel, 2026",
  },
  {
    value: "2023",
    label: "Début du parcours",
    detail: "Développement et sécurité, en continu depuis",
  },
];

const AchievementsSection = () => (
  <section id="achievements" className="section-shell relative">
    <SectionHeader
      label="En chiffres"
      title="Le parcours"
      titleAccent="en quelques repères"
      description="Ce que j'ai livré, ce que j'ai validé, et depuis quand."
      align="center"
    />

    <motion.div
      className="grid md:grid-cols-3 gap-px bg-border max-w-4xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {MILESTONES.map((m, i) => (
        <motion.div
          key={m.label}
          variants={fadeUp}
          custom={i}
          className="surface-card !rounded-none p-10 md:p-12 text-center group hover:bg-elevated/80 transition-colors duration-500"
        >
          <div className="font-display text-5xl md:text-6xl text-bone font-semibold tabular-nums mb-3">
            {m.value}
          </div>
          <p className="text-bone font-medium mb-1">{m.label}</p>
          <p className="text-mist text-sm">{m.detail}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default AchievementsSection;
