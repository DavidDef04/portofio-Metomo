import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/cms-auth";
import { getCachedGithubProjects } from "@/lib/github-cache";
import { revalidatePublicPages } from "@/lib/revalidate-public";

/**
 * Liste brute des dépôts GitHub (y compris privés et masqués) : réservée à
 * l'administration. Le site public passe par /api/projects, filtré.
 */
export async function GET() {
  try {
    await requireAdmin();
    const data = await getCachedGithubProjects();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.status === 401 ? "Non autorisé" : error.message },
      { status: error.status || 500 }
    );
  }
}

export async function POST() {
  try {
    await requireAdmin();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: error.status || 401 }
    );
  }
  revalidateTag("github-projects");
  revalidatePublicPages();
  return GET();
}
