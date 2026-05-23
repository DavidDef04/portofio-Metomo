import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { getResolvedSiteContent, updateSiteContent } from "@/lib/site-content";

export async function GET() {
  try {
    await requireAdmin();
    const content = await getResolvedSiteContent();
    return NextResponse.json({ success: true, content });
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
    const content = await updateSiteContent(body);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
