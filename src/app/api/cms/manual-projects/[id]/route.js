import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getManualProjects, saveManualProjects } from "@/lib/cms-store";

export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const projects = await getManualProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }
    projects[index] = {
      ...projects[index],
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };
    await saveManualProjects(projects);
    return NextResponse.json({ success: true, project: projects[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const projects = await getManualProjects();
    const filtered = projects.filter((p) => p.id !== id);
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }
    await saveManualProjects(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
