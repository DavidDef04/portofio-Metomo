import { NextResponse } from "next/server";
import crypto from "crypto";
import { requireAdmin } from "@/lib/cms-auth";
import { isBlobStorageEnabled, uploadPublicBlob } from "@/lib/cms-blob-storage";

export const maxDuration = 60;

/**
 * Capture d'écran d'un site (réservé à l'admin) via le service Microlink,
 * puis stockage dans le Blob Store. Retourne le chemin /api/media/… à
 * utiliser comme image de projet.
 */
export async function POST(req) {
  try {
    await requireAdmin();
    const { url } = await req.json();

    let target;
    try {
      target = new URL(String(url || ""));
    } catch {
      return NextResponse.json({ success: false, error: "Adresse invalide" }, { status: 400 });
    }
    if (target.protocol !== "https:") {
      return NextResponse.json({ success: false, error: "Seules les adresses https sont acceptées" }, { status: 400 });
    }
    if (!isBlobStorageEnabled()) {
      return NextResponse.json({ success: false, error: "Stockage indisponible" }, { status: 503 });
    }

    const api = new URL("https://api.microlink.io/");
    api.searchParams.set("url", target.href);
    api.searchParams.set("screenshot", "true");
    api.searchParams.set("meta", "false");
    api.searchParams.set("viewport.width", "1440");
    api.searchParams.set("viewport.height", "900");
    api.searchParams.set("viewport.deviceScaleFactor", "1");
    api.searchParams.set("waitForTimeout", "3000");
    api.searchParams.set("type", "jpeg");

    const meta = await fetch(api, { cache: "no-store" }).then((r) => r.json());
    const shotUrl = meta?.data?.screenshot?.url;
    if (!shotUrl) {
      return NextResponse.json(
        { success: false, error: `Capture impossible : ${meta?.message || "service indisponible"}` },
        { status: 502 }
      );
    }

    const res = await fetch(shotUrl, { cache: "no-store" });
    const buffer = Buffer.from(await res.arrayBuffer());
    if (!res.ok || buffer.length < 1000 || buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image de capture invalide" }, { status: 502 });
    }

    const name = `capture-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.jpg`;
    const path = await uploadPublicBlob(`cms-uploads/projects/${name}`, buffer, "image/jpeg");
    return NextResponse.json({ success: true, path });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.status === 401 ? "Non autorisé" : error.message },
      { status: error.status || 500 }
    );
  }
}
