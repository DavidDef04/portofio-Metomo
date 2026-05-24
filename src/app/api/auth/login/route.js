import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createSession,
  isCmsConfigured,
} from "@/lib/cms-auth";

export async function POST(req) {
  try {
    if (!isCmsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "CMS non configuré sur le serveur. Ajoutez ADMIN_USERNAME et ADMIN_PASSWORD dans Vercel → Settings → Environment Variables (Production), puis redéployez.",
        },
        { status: 503 }
      );
    }

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
