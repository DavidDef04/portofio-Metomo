import { NextResponse } from "next/server";
import { getPublicSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getPublicSiteContent();
    return NextResponse.json({ success: true, ...content });
  } catch (error) {
    console.error("GET /api/site-content:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
