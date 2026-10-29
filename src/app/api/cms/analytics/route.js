import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms-auth";
import { fetchDashboardStats } from "@/lib/ga4";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request) {
  try {
    await requireAdmin();
    const raw = Number(request.nextUrl.searchParams.get("days"));
    const days = [7, 28, 90].includes(raw) ? raw : 28;
    const stats = await fetchDashboardStats(days);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    if (error.status === 401) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json(
      {
        success: false,
        notConfigured: error.code === "NOT_CONFIGURED",
        error: error.details || error.message,
      },
      { status: error.code === "NOT_CONFIGURED" ? 503 : 500 }
    );
  }
}
