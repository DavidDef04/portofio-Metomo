import { NextResponse } from "next/server";
import { verifyAdminCredentials, createSession } from "@/lib/cms-auth";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { success: false, error: "Identifiants incorrects" },
        { status: 401 }
      );
    }
    await createSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
