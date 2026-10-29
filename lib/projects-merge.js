import {
  getManualProjects,
  getGithubMeta,
} from "@/lib/cms-store";
import { getCachedGithubProjects } from "@/lib/github-cache";
import { localize } from "@/lib/i18n";

const GITHUB_FETCH_MS = 25_000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout (${ms}ms)`)), ms)
    ),
  ]);
}

function applyMeta(project, rawMeta = {}, lang = "fr") {
  const meta = localize(rawMeta, lang);
  return {
    ...project,
    title: meta.title || project.title,
    description: meta.description || project.description,
    liveUrl: meta.liveUrl || project.liveUrl,
    visible: meta.visible !== false,
    featured: meta.featured === true,
    order: meta.order ?? project.order ?? 999,
  };
}

function normalizeManual(raw, lang = "fr") {
  const p = localize(raw, lang);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image || "",
    category: p.category || "Web",
    technologies: p.technologies || [],
    githubUrl: p.githubUrl || "",
    liveUrl: p.liveUrl || "",
    stars: p.stars ?? 0,
    forks: p.forks ?? 0,
    featured: p.featured === true,
    visible: p.visible !== false,
    order: p.order ?? 100,
    source: "manual",
    private: false,
    updated_at: p.updatedAt || p.updated_at || new Date().toISOString(),
  };
}

function normalizeGithub(p, meta, lang = "fr") {
  const applied = applyMeta(
    {
      id: p.id,
      githubId: p.githubId,
      title: p.title,
      description: p.description,
      image: p.image,
      category: p.category,
      technologies: p.topics?.slice(0, 4) || [p.language].filter(Boolean),
      githubUrl: p.html_url,
      liveUrl: p.homepage || "",
      stars: p.stargazers_count ?? 0,
      forks: p.forks_count ?? 0,
      featured: false,
      visible: true,
      order: 500,
      source: "github",
      private: p.private === true,
      updated_at: p.updated_at,
    },
    meta[p.id] || meta[p.githubId] || {},
    lang
  );
  return applied;
}

/** Dépôts privés : visibles sur le portfolio, sans lien GitHub public */
function sanitizeForPublicView(project) {
  if (!project.private) return project;
  return {
    ...project,
    githubUrl: "",
    githubId: undefined,
  };
}

export async function getMergedProjects({
  includeHidden = false,
  skipGithub = false,
  forPublic = false,
  lang = "fr",
} = {}) {
  const [manual, githubMeta] = await Promise.all([
    getManualProjects(),
    getGithubMeta(),
  ]);

  let githubList = [];
  if (!skipGithub) {
    try {
      const { projects } = await withTimeout(
        getCachedGithubProjects(),
        GITHUB_FETCH_MS,
        "GitHub"
      );
      githubList = projects;
    } catch (e) {
      console.error("GitHub fetch:", e.message || e);
    }
  }

  const manualNorm = manual.map((p) => normalizeManual(p, lang));
  const githubNorm = githubList.map((p) => normalizeGithub(p, githubMeta, lang));

  const merged = [...manualNorm, ...githubNorm].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  let result = includeHidden ? merged : merged.filter((p) => p.visible);
  if (forPublic) result = result.map(sanitizeForPublicView);
  return result;
}
