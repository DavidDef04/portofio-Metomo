import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { fetchAllGithubProjects } from "@/lib/github-sync";
import { getGithubUsernames, getGithubOrgs } from "@/lib/github-config";

/** Diagnostic admin : combien de dépôts GitHub sont récupérés */
export async function GET() {
  try {
    await requireAdmin();
    const data = await fetchAllGithubProjects(500);
    const byOwner = {};
    for (const p of data.projects) {
      byOwner[p.author] = (byOwner[p.author] || 0) + 1;
    }
    return NextResponse.json({
      success: true,
      stats: data.stats,
      usernames: getGithubUsernames(),
      orgs: getGithubOrgs(),
      byOwner,
      sample: data.projects.slice(0, 5).map((p) => ({
        id: p.githubId,
        private: p.private,
        fork: p.is_fork,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
