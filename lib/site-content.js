import { getSiteContent, saveSiteContent } from "@/lib/cms-store";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";

function mergeHero(stored) {
  const d = DEFAULT_SITE_CONTENT.hero;
  const s = stored || {};
  return {
    ...d,
    ...s,
    social: { ...d.social, ...(s.social || {}) },
    roles:
      Array.isArray(s.roles) && s.roles.length > 0 ? s.roles : d.roles,
  };
}

function mergeAbout(stored) {
  return { ...DEFAULT_SITE_CONTENT.about, ...(stored || {}) };
}

function mergeList(stored, fallback) {
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return fallback;
}

export async function getResolvedSiteContent() {
  const stored = await getSiteContent();
  return {
    hero: mergeHero(stored?.hero),
    about: mergeAbout(stored?.about),
    experiences: mergeList(stored?.experiences, DEFAULT_SITE_CONTENT.experiences),
    education: mergeList(stored?.education, DEFAULT_SITE_CONTENT.education),
  };
}

function sortVisible(items) {
  return [...items]
    .filter((item) => item.visible !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export async function getPublicSiteContent() {
  const content = await getResolvedSiteContent();
  return {
    hero: content.hero,
    about: content.about,
    experiences: sortVisible(content.experiences),
    education: sortVisible(content.education),
  };
}

export async function updateSiteContent(partial) {
  const current = await getResolvedSiteContent();
  const next = {
    hero: partial.hero ? mergeHero({ ...current.hero, ...partial.hero }) : current.hero,
    about: partial.about
      ? mergeAbout({ ...current.about, ...partial.about })
      : current.about,
    experiences:
      partial.experiences !== undefined
        ? partial.experiences
        : current.experiences,
    education:
      partial.education !== undefined ? partial.education : current.education,
  };
  await saveSiteContent(next);
  return next;
}
