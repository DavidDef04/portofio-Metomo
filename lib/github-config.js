/** Comptes GitHub à inclure (owners exacts). Séparés par des virgules dans .env */
export function getGithubUsernames() {
  const fromEnv = process.env.GITHUB_USERNAMES?.trim();
  if (fromEnv) {
    return fromEnv.split(",").map((u) => u.trim()).filter(Boolean);
  }
  return ["DavidDef04", "alcdigitaldeveloppeur01-arch", "alcdigitaldeveloppeur01"];
}

/** Organisations / entreprise (owners de dépôts hors compte perso) */
export function getGithubOrgs() {
  const fromEnv = process.env.GITHUB_ORGS?.trim();
  if (!fromEnv) return [];
  return fromEnv.split(",").map((o) => o.trim()).filter(Boolean);
}

export function shouldIncludeForks() {
  return process.env.GITHUB_INCLUDE_FORKS === "true";
}

/** Avec token : inclure tous les dépôts accessibles (pas seulement les owners listés) */
export function includeAllAccessibleRepos() {
  return process.env.GITHUB_FILTER_STRICT !== "true";
}
