import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/cms-auth";
import { getGithubMeta, saveGithubMeta } from "@/lib/cms-store";
import { getCachedGithubProjects } from "@/lib/github-cache";
import { revalidatePublicPages } from "@/lib/revalidate-public";

export async function GET() {
  try {
    await requireAdmin();
    const [meta, github] = await Promise.all([
      getGithubMeta(),
      getCachedGithubProjects(),
    ]);
    const projects = github.projects.map((p) => {
      const m = meta[p.id] || meta[p.githubId] || {};
      return {
        ...p,
        visible: m.visible !== false,
        featured: m.featured === true,
        order: m.order ?? 500,
        // Valeurs d'affichage saisies dans le CMS (prioritaires sur GitHub)
        overrides: {
          title: m.title || "",
          liveUrl: m.liveUrl || "",
          description: m.description || "",
          image: m.image || "",
          title_en: m.title_en || "",
          description_en: m.description_en || "",
        },
      };
    });
    return NextResponse.json({ success: true, meta, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await requireAdmin();
    const body = await req.json();
    const meta = await getGithubMeta();
    const key = body.id || body.githubId;
    if (!key) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }
    const previous = meta[key] || {};
    const next = { ...previous };
    if ("visible" in body) next.visible = body.visible !== false;
    if ("featured" in body) next.featured = body.featured === true;
    if ("order" in body) next.order = Number.isFinite(Number(body.order)) ? Number(body.order) : 500;
    for (const f of ["title", "liveUrl", "description", "title_en", "description_en", "image"]) {
      if (typeof body[f] === "string") next[f] = body[f].trim();
    }
    meta[key] = next;
    await saveGithubMeta(meta);
    revalidateTag("github-projects");
    revalidatePublicPages();
    return NextResponse.json({ success: true, meta: meta[key] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
