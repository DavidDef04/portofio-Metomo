import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getCertifications, saveCertifications } from "@/lib/cms-store";

export async function PUT(req, { params }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const list = await getCertifications();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    list[index] = { ...list[index], ...body, id };
    await saveCertifications(list);
    return NextResponse.json({ success: true, certification: list[index] });
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
    const list = await getCertifications();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    await saveCertifications(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
