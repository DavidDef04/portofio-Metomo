import { NextResponse } from "next/server";
import { getCertifications } from "@/lib/cms-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await getCertifications();
    const visible = all
      .filter((c) => c.visible !== false)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return NextResponse.json({ success: true, certifications: visible });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
