import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getCertifications, saveCertifications, newId } from "@/lib/cms-store";
import { revalidatePublicPages } from "@/lib/revalidate-public";

export async function GET() {
  try {
    await requireAdmin();
    const certifications = await getCertifications();
    return NextResponse.json({ success: true, certifications });
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
    const list = await getCertifications();
    const item = {
      id: newId(),
      name: body.name?.trim() || "",
      issuer: body.issuer?.trim() || "",
      date: body.date?.trim() || "",
      description: body.description?.trim() || "",
      visible: body.visible !== false,
      order: Number(body.order) || 100,
      createdAt: new Date().toISOString(),
    };
    list.push(item);
    await saveCertifications(list);
    revalidatePublicPages();
    return NextResponse.json({ success: true, certification: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
