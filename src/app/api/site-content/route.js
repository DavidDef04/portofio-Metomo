import { NextResponse } from "next/server";
import { getPublicSiteContent } from "@/lib/site-content";
import { normalizeLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const lang = normalizeLang(request.nextUrl.searchParams.get("lang"));
    const content = await getPublicSiteContent(lang);
    return NextResponse.json({ success: true, ...content });
  } catch (error) {
    console.error("GET /api/site-content:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
