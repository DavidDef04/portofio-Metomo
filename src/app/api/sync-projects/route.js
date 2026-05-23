import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getCachedGithubProjects } from "@/lib/github-cache";

export async function GET() {
  try {
    const data = await getCachedGithubProjects();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  revalidateTag("github-projects");
  return GET();
}
