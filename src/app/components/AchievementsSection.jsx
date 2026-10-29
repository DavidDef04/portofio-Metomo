"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getDict } from "@/lib/i18n";

// Repères (textes dans lib/i18n.js → achievements.items), à mettre à jour
// quand le parcours évolue.

const AchievementsSection = ({ lang = "fr" }) => {
  const t = getDict(lang).achievements;
  return (
  <section id="achievements" className="section-shell relative">
    <SectionHeader
      label={t.label}
      title={t.title}
      titleAccent={t.accent}
      description={t.description}
      align="center"
    />

    <motion.div
      className="grid md:grid-cols-3 gap-px bg-border max-w-4xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {t.items.map((m, i) => (
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
};

export default AchievementsSection;
