"use client";
import React, { useState, useRef, forwardRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaLock } from "react-icons/fa";
import SectionHeader from "./ui/SectionHeader";
import AmbientBackground from "./ui/AmbientBackground";
import { fadeUp, staggerContainer } from "@/lib/motion";

const categories = ["Tous", "Web", "Mobile", "Cybersécurité", "IA"];

const ModernProjectSection = forwardRef((props, ref) => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const sectionRef = useRef(null);

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const quickRes = await fetch("/api/projects?quick=1", { cache: "no-store" });
      const quickData = await quickRes.json();
      if (quickData.success && quickData.projects.length > 0) {
        setAllProjects(quickData.projects);
        setLastSync(new Date());
        setIsLoading(false);
      }

      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setAllProjects(data.projects);
        setLastSync(new Date());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    const onVisible = () => {
      if (document.visibilityState === "visible") loadProjects();
    };
    window.addEventListener("focus", loadProjects);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", loadProjects);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadProjects]);

  const filtered =
    selectedCategory === "Tous"
      ? allProjects
      : allProjects.filter((p) => p.category === selectedCategory);

  const display = filtered;

  return (
    <section ref={sectionRef} id="projects" className="section-shell relative">
      <AmbientBackground />
      <SectionHeader
        label="Études de cas"
        title="Projets"
        titleAccent="& réalisations"
        description="Projets manuels et dépôts GitHub (publics et privés). Visibilité gérée depuis le CMS."
      />

      {isLoading && (
        <p className="text-center label-mono text-mist mb-8">Chargement des projets…</p>
      )}
      {!isLoading && lastSync && (
        <p className="text-center text-mist text-xs mb-8">
          {allProjects.length} projet{allProjects.length > 1 ? "s" : ""} visible
          · Dernière synchro : {lastSync.toLocaleString("fr-CM")}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
              selectedCategory === cat
                ? "border-champagne text-champagne bg-champagne/5"
                : "border-border text-mist hover:text-bone"
            }`}
            style={{ borderRadius: "var(--radius-cut)" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && display.length === 0 && (
        <div
          className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3"
          aria-hidden
        >
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="surface-card !rounded-none overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-elevated" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-24 bg-elevated rounded" />
                <div className="h-5 w-3/4 bg-elevated rounded" />
                <div className="h-4 w-full bg-elevated rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && display.length > 0 && (
      <motion.div
        key={`grid-${display.length}-${selectedCategory}`}
        className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {display.map((project, i) => (
          <motion.article
            key={project.id}
            variants={fadeUp}
            custom={i}
            className="group surface-card !rounded-none overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-elevated">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
              {project.private && (
                <span className="absolute top-3 left-3 flex items-center gap-1 text-xs text-champagne bg-void/80 px-2 py-1">
                  <FaLock className="text-[10px]" /> Privé
                </span>
              )}
              <div className="absolute top-4 right-4 flex gap-3 text-xs text-silver">
                <span className="flex items-center gap-1">
                  <FaStar className="text-champagne" /> {project.stars ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <FaCodeBranch /> {project.forks ?? 0}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <p className="label-mono !text-[0.55rem] mb-2">
                {project.category} · {project.source === "manual" ? "CMS" : "GitHub"}
              </p>
              <h3 className="font-display text-lg text-bone font-semibold mb-2 group-hover:text-champagne transition-colors">
                {project.title}
              </h3>
              <p className="text-mist text-sm line-clamp-2 mb-4 flex-1">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(project.technologies || []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[0.65rem] text-mist border border-border px-2 py-0.5"
                    style={{ borderRadius: "var(--radius-cut)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mist hover:text-bone transition-colors"
                    aria-label="GitHub"
                  >
                    <FaGithub />
                  </a>
                )}
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mist hover:text-champagne transition-colors"
                    aria-label="Voir le projet"
                  >
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
      )}

      {!isLoading && display.length === 0 && (
        <p className="text-center text-mist py-16">
          Aucun projet visible. Activez-en depuis le{" "}
          <a href="/login" className="text-champagne hover:underline">
            CMS
          </a>
          .
        </p>
      )}

      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={loadProjects}
          className="btn-premium btn-premium--ghost"
        >
          Actualiser
        </button>
        <a
          href="https://github.com/DavidDef04"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium btn-premium--primary"
        >
          GitHub
        </a>
      </div>
    </section>
  );
});

ModernProjectSection.displayName = "ModernProjectSection";
export default ModernProjectSection;
