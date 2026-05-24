"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionHeader from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

function aggregateFromProjects(projects = []) {
  const stacks = new Set();
  let githubStars = 0;

  for (const p of projects) {
    githubStars += Number(p.stars) || 0;
    if (p.category) stacks.add(String(p.category).trim());
    for (const t of p.technologies || []) {
      const name = String(t).trim();
      if (name) stacks.add(name);
    }
  }

  return { githubStars, stackCount: stacks.size };
}

const AchievementsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    githubStars: 0,
    stackCount: 0,
    experience: 0,
    experienceSince: "2024",
  });

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, statsRes] = await Promise.all([
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/stats", { cache: "no-store" }),
        ]);

        const projectsData = await projectsRes.json();
        const statsData = await statsRes.json();
        const projects = projectsData.success ? projectsData.projects ?? [] : [];
        const { githubStars, stackCount } = aggregateFromProjects(projects);

        setStats({
          projects: projectsData.success
            ? projectsData.count ?? projects.length
            : 0,
          githubStars,
          stackCount,
          experience: statsData.experience ?? 0,
          experienceSince: statsData.experienceSince ?? "2024",
        });
      } catch {
        setStats((s) => ({ ...s, projects: 0, githubStars: 0, stackCount: 0 }));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const metrics = [
    {
      value: stats.projects,
      label: "Livrables produit",
      suffix: "+",
      detail: "Projets & dépôts actifs",
    },
    {
      value: stats.githubStars > 0 ? stats.githubStars : stats.stackCount,
      label: stats.githubStars > 0 ? "Étoiles GitHub" : "Stacks & outils",
      suffix: stats.githubStars > 0 ? "" : "+",
      detail:
        stats.githubStars > 0
          ? "Reconnaissance sur l'open source"
          : "Technologies mobilisées en production",
    },
    {
      value: stats.experience,
      label: "Années de pratique",
      suffix: "",
      detail: `Depuis ${stats.experienceSince}`,
      decimals: 1,
    },
  ];

  return (
    <section id="achievements" ref={ref} className="section-shell relative">
      <SectionHeader
        label="Impact mesurable"
        title="Des chiffres qui"
        titleAccent="parlent de rigueur"
        description="Projets livrés, reconnaissance GitHub et années de pratique — des indicateurs concrets, tirés de votre portfolio."
        align="center"
      />

      <motion.div
        className="grid md:grid-cols-3 gap-px bg-border max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            variants={fadeUp}
            custom={i}
            className="surface-card !rounded-none p-10 md:p-12 text-center group hover:bg-elevated/80 transition-colors duration-500"
          >
            <div
              className="font-display text-5xl md:text-6xl text-bone font-semibold tabular-nums mb-3 flex items-center justify-center gap-0.5"
              aria-label={`${m.prefix ?? ""}${m.value}${m.suffix ?? ""}`}
            >
              {m.prefix && <span>{m.prefix}</span>}
              {isLoading ? (
                <span className="text-mist">—</span>
              ) : m.decimals ? (
                <span>{Number(m.value).toFixed(1)}</span>
              ) : (
                <AnimatedNumbers
                  animateToNumber={Math.round(m.value)}
                  locale="fr-CM"
                  configs={(_, idx) => ({
                    mass: 1,
                    friction: 100,
                    tension: 120 * (idx + 1),
                  })}
                />
              )}
              {m.suffix && <span>{m.suffix}</span>}
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
