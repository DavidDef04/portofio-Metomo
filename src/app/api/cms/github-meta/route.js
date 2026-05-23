import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/cms-auth";
import { getGithubMeta, saveGithubMeta } from "@/lib/cms-store";
import { getCachedGithubProjects } from "@/lib/github-cache";

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
    meta[key] = {
      visible: body.visible !== false,
      featured: body.featured === true,
      order: Number(body.order) ?? 500,
    };
    await saveGithubMeta(meta);
    revalidateTag("github-projects");
    return NextResponse.json({ success: true, meta: meta[key] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
