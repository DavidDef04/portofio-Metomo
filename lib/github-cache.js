import { unstable_cache } from "next/cache";
import { fetchAllGithubProjects } from "@/lib/github-sync";

export const getCachedGithubProjects = unstable_cache(
  async () => fetchAllGithubProjects(),
  ["all-github-repos"],
  { revalidate: 300, tags: ["github-projects"] }
);
