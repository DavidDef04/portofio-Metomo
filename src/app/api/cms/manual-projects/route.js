import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import {
  getManualProjects,
  saveManualProjects,
  newId,
} from "@/lib/cms-store";
import { revalidatePublicPages } from "@/lib/revalidate-public";

export async function GET() {
  try {
    await requireAdmin();
    const projects = await getManualProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    await requireAdmin();
    const body = await req.json();
    const projects = await getManualProjects();
    const now = new Date().toISOString();
    const item = {
      id: newId(),
      title: body.title?.trim() || "Sans titre",
      description: body.description?.trim() || "",
      image: body.image?.trim() || "",
      category: body.category || "Web",
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      githubUrl: body.githubUrl?.trim() || "",
      liveUrl: body.liveUrl?.trim() || "",
      visible: body.visible !== false,
      featured: body.featured === true,
      order: Number(body.order) || 100,
      createdAt: now,
      updatedAt: now,
    };
    projects.push(item);
    await saveManualProjects(projects);
    revalidatePublicPages();
    return NextResponse.json({ success: true, project: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
