"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaArrowRight, FaLock } from "react-icons/fa";
import SectionHeader from "./ui/SectionHeader";
import AmbientBackground from "./ui/AmbientBackground";
import { fadeUp } from "@/lib/motion";
import { getDict, categoryLabel } from "@/lib/i18n";

const ALL = "__all__";
const CATEGORY_ORDER = ["Web", "Mobile", "Cybersécurité", "IA"];
const OTHERS_PREVIEW = 6;
const FULL_TIMEOUT_MS = 60_000;

/** Un lien « démo » qui pointe vers GitHub n'est pas une démo. */
function liveLink(project) {
  const url = (project.liveUrl || "").trim();
  if (!url || url === "#" || /github\.com/i.test(url)) return "";
  return url;
}

function codeLink(project) {
  if (project.private) return "";
  return (project.githubUrl || "").trim();
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* ─── Visuel : capture du projet, ou composition typographique ─── */
function ProjectVisual({ project, index, large = false, t, lang }) {
  const [broken, setBroken] = useState(false);
  const hasImage = project.image && !broken;

  return (
    <div
      className={`relative overflow-hidden bg-elevated ${
        large ? "aspect-[16/10]" : "aspect-[16/9]"
      }`}
    >
      {hasImage ? (
        <img
          src={project.image}
          alt={t.preview(project.title)}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="project-visual-fallback absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {large ? (
            <>
              <span className="label-mono !text-[0.6rem] mb-3">{categoryLabel(project.category, lang)}</span>
              <span className="font-display font-semibold text-bone/90 leading-none text-4xl md:text-6xl">
                {project.title}
              </span>
            </>
          ) : (
            // Petite carte : le titre est déjà juste en dessous, on affiche des initiales
            <span aria-hidden className="font-display font-semibold text-champagne/40 leading-none text-5xl">
              {project.title
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-void/50 via-transparent to-transparent" />
    </div>
  );
}

function TechList({ items = [], max }) {
  const list = max ? items.slice(0, max) : items;
  if (!list.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {list.map((t) => (
        <li
          key={t}
          className="text-[0.7rem] text-silver border border-border px-2.5 py-1"
          style={{ borderRadius: "var(--radius-cut)" }}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ─── Projet en vedette : étude de cas ─── */
function FeaturedProject({ project, index, t, lang }) {
  const live = liveLink(project);
  const code = codeLink(project);
  const reversed = index % 2 === 1;

  return (
    <motion.article
      className="group grid lg:grid-cols-12 gap-8 lg:gap-14 items-center"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className={`lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
        <div className="clip-chamfer border border-border">
          {live ? (
            <a href={live} target="_blank" rel="noopener noreferrer" aria-label={t.open(project.title)}>
              <ProjectVisual project={project} index={index} large t={t} lang={lang} />
            </a>
          ) : (
            <ProjectVisual project={project} index={index} large t={t} lang={lang} />
          )}
        </div>
      </div>

      <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
        <p className="label-mono !text-[0.6rem] mb-4">
          {String(index + 1).padStart(2, "0")} — {categoryLabel(project.category, lang)}
        </p>
        <h3 className="font-display text-h2 text-bone font-semibold mb-5">
          {project.title}
        </h3>
        <p className="text-bone-dim leading-relaxed mb-6 whitespace-pre-line">
          {project.description}
        </p>
        <div className="mb-8">
          <TechList items={project.technologies} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium btn-premium--primary"
            >
              {t.visit}
              <FaArrowRight className="text-[0.7rem]" aria-hidden />
            </a>
          )}
          {code && (
            <a
              href={code}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium btn-premium--ghost"
            >
              <FaGithub aria-hidden /> {t.code}
            </a>
          )}
          {!code && project.private && (
            <span className="flex items-center gap-2 text-xs text-mist">
              <FaLock className="text-champagne text-[10px]" aria-hidden />
              {t.privateCode}
            </span>
          )}
          {live && (
            <span className="text-xs text-mist">{hostOf(live)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Autres travaux : carte compacte, sans image ─── */
function OtherProject({ project, t, lang }) {
  const live = liveLink(project);
  const code = codeLink(project);
  const href = live || code;

  return (
    <article className="group surface-card !rounded-none flex flex-col h-full overflow-hidden">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden>
          <ProjectVisual project={project} index={99} t={t} lang={lang} />
        </a>
      ) : (
        <ProjectVisual project={project} index={99} t={t} lang={lang} />
      )}
      <div className="p-6 flex flex-col flex-1">
      <p className="label-mono !text-[0.55rem] mb-3">{categoryLabel(project.category, lang)}</p>
      <h4 className="font-display text-lg text-bone font-semibold mb-2">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-champagne transition-colors"
          >
            {project.title}
          </a>
        ) : (
          project.title
        )}
      </h4>
      {project.description && (
        <p className="text-mist text-sm line-clamp-3 mb-4">{project.description}</p>
      )}
      <div className="mt-auto pt-2 flex items-end justify-between gap-4">
        <TechList items={project.technologies} max={3} />
        <div className="flex items-center gap-3 text-mist shrink-0">
          {code && (
            <a
              href={code}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bone transition-colors"
              aria-label={t.codeOf(project.title)}
            >
              <FaGithub />
            </a>
          )}
          {!code && project.private && (
            <FaLock className="text-[10px] text-champagne/70" title={t.privateRepo} aria-label={t.privateRepo} />
          )}
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-champagne transition-colors"
              aria-label={t.liveOf(project.title)}
            >
              <FaArrowRight className="text-xs" />
            </a>
          )}
        </div>
      </div>
      </div>
    </article>
  );
}

/** @param {{ initialProjects?: any[], lang?: "fr" | "en" }} props */
export default function ModernProjectSection({ initialProjects, lang = "fr" }) {
  const t = getDict(lang).projects;
  const [projects, setProjects] = useState(() => initialProjects || []);
  const [loading, setLoading] = useState(() => !initialProjects?.length);
  const [category, setCategory] = useState(ALL);
  const [showAllOthers, setShowAllOthers] = useState(false);

  // Les projets du CMS arrivent avec la page ; on complète ensuite
  // avec les dépôts GitHub synchronisés, en arrière-plan.
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FULL_TIMEOUT_MS);
    fetch(`/api/projects?lang=${lang}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.projects)) setProjects(data.projects);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timer);
        setLoading(false);
      });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [lang]);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const others = useMemo(() => projects.filter((p) => !p.featured), [projects]);

  const categories = useMemo(() => {
    const present = new Set(others.map((p) => p.category));
    return [ALL, ...CATEGORY_ORDER.filter((c) => present.has(c))];
  }, [others]);

  const filteredOthers =
    category === ALL ? others : others.filter((p) => p.category === category);
  const visibleOthers = showAllOthers
    ? filteredOthers
    : filteredOthers.slice(0, OTHERS_PREVIEW);

  return (
    <section id="projects" className="section-shell relative">
      <AmbientBackground />
      <SectionHeader
        label={t.label}
        title={t.title}
        titleAccent={t.accent}
        description={t.description}
      />

      {loading && featured.length === 0 && (
        <div className="grid lg:grid-cols-12 gap-10 animate-pulse" aria-hidden>
          <div className="lg:col-span-7 aspect-[16/10] bg-elevated" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-3 w-24 bg-elevated" />
            <div className="h-8 w-2/3 bg-elevated" />
            <div className="h-4 w-full bg-elevated" />
            <div className="h-4 w-5/6 bg-elevated" />
          </div>
        </div>
      )}

      {featured.length > 0 && (
        <div className="space-y-24 md:space-y-32">
          {featured.map((p, i) => (
            <FeaturedProject key={p.id} project={p} index={i} t={t} lang={lang} />
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="mt-28 md:mt-36">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="label-mono mb-3">{t.archives}</p>
              <h3 className="font-display text-h3 text-bone font-semibold">
                {t.others}
              </h3>
            </div>
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.filter}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={category === cat}
                    onClick={() => {
                      setCategory(cat);
                      setShowAllOthers(false);
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${
                      category === cat
                        ? "border-champagne text-champagne bg-champagne/5"
                        : "border-border text-mist hover:text-bone"
                    }`}
                    style={{ borderRadius: "var(--radius-cut)" }}
                  >
                    {cat === ALL ? t.all : categoryLabel(cat, lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {visibleOthers.map((p) => (
              <OtherProject key={p.id} project={p} t={t} lang={lang} />
            ))}
          </div>

          {filteredOthers.length > OTHERS_PREVIEW && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAllOthers((v) => !v)}
                className="btn-premium btn-premium--ghost"
              >
                {showAllOthers ? t.showLess : t.showAll(filteredOthers.length)}
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-center text-mist py-16">
          {t.empty}
        </p>
      )}

      <div className="mt-16 flex justify-center">
        <a
          href="https://github.com/DavidDef04"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-premium btn-premium--ghost"
        >
          <FaGithub aria-hidden /> {t.github}
        </a>
      </div>
    </section>
  );
}
