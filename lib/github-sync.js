import {
  getGithubUsernames,
  getGithubOrgs,
  shouldIncludeForks,
  includeAllAccessibleRepos,
} from "@/lib/github-config";

function formatTitle(name) {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function determineCategory(name, description, topics = [], language = "") {
  const text = `${name} ${description} ${topics.join(" ")} ${language}`.toLowerCase();
  if (["ai", "ml", "n8n", "automation", "chatbot", "llm"].some((k) => text.includes(k)))
    return "IA";
  if (["flutter", "dart", "mobile", "android", "ios"].some((k) => text.includes(k)))
    return "Mobile";
  if (["security", "cyber", "pentest"].some((k) => text.includes(k)))
    return "Cybersécurité";
  return "Web";
}

function mapRepo(repo, type = "personal") {
  const owner = repo.owner?.login || "unknown";
  const githubId = `${owner}/${repo.name}`;
  return {
    id: `github-${repo.id}`,
    githubId,
    title: formatTitle(repo.name),
    description:
      repo.description ||
      `Projet ${formatTitle(repo.name)} — GitHub${repo.private ? " (privé)" : ""}`,
    image: `https://opengraph.githubassets.com/1/${owner}/${repo.name}`,
    html_url: repo.html_url,
    homepage: repo.homepage || "",
    full_name: githubId,
    language: repo.language,
    topics: repo.topics || [],
    stargazers_count: repo.stargazers_count ?? 0,
    forks_count: repo.forks_count ?? 0,
    category: determineCategory(
      repo.name,
      repo.description || "",
      repo.topics,
      repo.language || ""
    ),
    author: owner,
    type,
    source: "github",
    private: repo.private === true,
    is_fork: repo.fork === true,
    updated_at: repo.updated_at,
  };
}

function buildAllowList(usernames, orgs) {
  return new Set(
    [...usernames, ...orgs].map((s) => s.toLowerCase())
  );
}

function isRepoIncluded(repo, allowForks) {
  if (!repo) return false;
  if (!allowForks && repo.fork) return false;
  return true;
}

function ownerAllowed(ownerLogin, allowList, loose) {
  if (loose) return true;
  if (!allowList.size) return true;
  return allowList.has((ownerLogin || "").toLowerCase());
}

async function fetchPaginated(url, headers) {
  const all = [];
  let page = 1;
  while (page <= 20) {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}per_page=100&page=${page}`, {
      headers,
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`GitHub ${url} page ${page}:`, res.status, text.slice(0, 200));
      break;
    }
    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) break;
    all.push(...repos);
    if (repos.length < 100) break;
    page += 1;
  }
  return all;
}

/**
 * Récupère tous les dépôts accessibles (publics + privés avec GITHUB_TOKEN scope repo).
 */
export async function fetchAllGithubProjects(maxTotal = 500) {
  const githubToken = process.env.GITHUB_TOKEN;
  const usernames = getGithubUsernames();
  const orgs = getGithubOrgs();
  const allowList = buildAllowList(usernames, orgs);
  const allowForks = shouldIncludeForks();
  const loose = includeAllAccessibleRepos() && Boolean(githubToken);

  const headers = {
    Accept: "application/vnd.github.v3+json",
    ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
  };

  const allProjects = [];
  const seen = new Set();

  const pushRepo = (repo, type) => {
    if (!isRepoIncluded(repo, allowForks)) return;
    const owner = repo.owner?.login;
    if (!ownerAllowed(owner, allowList, loose)) return;
    const key = `${owner}/${repo.name}`;
    if (seen.has(key)) return;
    seen.add(key);
    allProjects.push(
      mapRepo(
        repo,
        usernames.some((u) => u.toLowerCase() === (owner || "").toLowerCase())
          ? "personal"
          : "collaboration"
      )
    );
  };

  if (githubToken) {
    const tokenRepos = await fetchPaginated(
      "https://api.github.com/user/repos?sort=updated&affiliation=owner,collaborator,organization_member",
      headers
    );
    for (const repo of tokenRepos) pushRepo(repo, "personal");
  }

  for (const username of usernames) {
    const typeParam = githubToken ? "all" : "public";
    const userRepos = await fetchPaginated(
      `https://api.github.com/users/${username}/repos?type=${typeParam}&sort=updated`,
      headers
    );
    for (const repo of userRepos) pushRepo(repo, "personal");
  }

  for (const org of orgs) {
    const orgRepos = await fetchPaginated(
      `https://api.github.com/orgs/${org}/repos?type=all&sort=updated`,
      headers
    );
    for (const repo of orgRepos) pushRepo(repo, "collaboration");
  }

  allProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  const sliced = allProjects.slice(0, maxTotal);

  return {
    projects: sliced,
    stats: {
      totalFetched: allProjects.length,
      returned: sliced.length,
      publicCount: sliced.filter((p) => !p.private).length,
      privateCount: sliced.filter((p) => p.private).length,
      accounts: usernames,
      orgs,
      hasToken: Boolean(githubToken),
      includeForks: allowForks,
      filterMode: loose ? "all_accessible" : "owners_only",
    },
  };
}

export { getGithubUsernames };
