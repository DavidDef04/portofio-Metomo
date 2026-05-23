import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getManualProjects, saveManualProjects } from "@/lib/cms-store";
import { revalidatePublicPages } from "@/lib/revalidate-public";
import { deletePublicAssetIfManaged } from "@/lib/cms-files";

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
    const previous = projects[index];
    const nextImage = body.image?.trim() ?? previous.image;
    if (previous.image && previous.image !== nextImage) {
      await deletePublicAssetIfManaged(previous.image);
    }
    projects[index] = {
      ...previous,
      ...body,
      id,
      image: nextImage,
      updatedAt: new Date().toISOString(),
    };
    await saveManualProjects(projects);
    revalidatePublicPages();
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
    const removed = projects.find((p) => p.id === id);
    if (!removed) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }
    const filtered = projects.filter((p) => p.id !== id);
    if (removed.image) {
      await deletePublicAssetIfManaged(removed.image);
    }
    await saveManualProjects(filtered);
    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
