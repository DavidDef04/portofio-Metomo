import { NextResponse } from "next/server";
import { getMergedProjects } from "@/lib/projects-merge";

export async function GET(request) {
  try {
    const quick = request.nextUrl.searchParams.get("quick") === "1";
    const projects = await getMergedProjects({
      includeHidden: false,
      skipGithub: quick,
    });
    return NextResponse.json({
      success: true,
      projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("GET /api/projects:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
