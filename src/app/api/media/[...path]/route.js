import { readMediaBlob } from "@/lib/cms-blob-storage";

/**
 * Sert les fichiers téléversés depuis le CMS (images, CV), stockés en accès
 * privé dans le Blob Store. Seul le dossier cms-uploads/ est exposé.
 */
export async function GET(req, { params }) {
  const { path: parts } = await params;
  const pathname = (parts || []).join("/");

  if (!pathname.startsWith("cms-uploads/") || pathname.includes("..")) {
    return new Response("Introuvable", { status: 404 });
  }

  try {
    const blob = await readMediaBlob(pathname);
    if (!blob) return new Response("Introuvable", { status: 404 });

    // Les images ont un nom unique : cache long. Le CV garde un nom fixe.
    const cacheControl = pathname.startsWith("cms-uploads/cv/")
      ? "public, max-age=300, s-maxage=300"
      : "public, max-age=31536000, immutable";

    return new Response(blob.stream, {
      headers: {
        "Content-Type": blob.blob?.contentType || "application/octet-stream",
        "Cache-Control": cacheControl,
      },
    });
  } catch (e) {
    console.error("GET /api/media:", e.message);
    return new Response("Erreur", { status: 500 });
  }
}
