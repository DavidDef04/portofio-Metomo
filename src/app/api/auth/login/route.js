import { NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  createSession,
  isCmsConfigured,
} from "@/lib/cms-auth";
import { clientIp, lockedFor, recordFailure, recordSuccess } from "@/lib/login-throttle";

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

    const ip = clientIp(req);
    const wait = await lockedFor(ip);
    if (wait > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Trop de tentatives. Réessayez dans ${Math.ceil(wait / 60)} min.`,
        },
        { status: 429, headers: { "Retry-After": String(wait) } }
      );
    }

    const { username, password } = await req.json();
    if (!verifyAdminCredentials(username, password)) {
      await recordFailure(ip);
      // Petit délai : ralentit les essais en série
      await new Promise((r) => setTimeout(r, 600));
      return NextResponse.json(
        { success: false, error: "Identifiants incorrects" },
        { status: 401 }
      );
    }
    await recordSuccess(ip);
    await createSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
