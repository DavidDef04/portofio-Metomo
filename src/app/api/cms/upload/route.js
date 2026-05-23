import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/cms-auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CV_BYTES = 10 * 1024 * 1024;
const IMAGE_DIR = path.join(process.cwd(), "public", "images", "projects");
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function POST(req) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");
    const kind = formData.get("kind") === "cv" ? "cv" : "image";

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: "Aucun fichier sélectionné" },
        { status: 400 }
      );
    }

    if (kind === "cv") {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, error: "Le CV doit être un fichier PDF" },
          { status: 400 }
        );
      }
      if (file.size > MAX_CV_BYTES) {
        return NextResponse.json(
          { success: false, error: "PDF trop volumineux (max 10 Mo)" },
          { status: 400 }
        );
      }
      const name = `CV_${Date.now()}.pdf`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(PUBLIC_DIR, name), buffer);
      return NextResponse.json({ success: true, path: `/${name}` });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format non autorisé (JPG, PNG, WebP, GIF ou SVG uniquement)",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Fichier trop volumineux (max 5 Mo)" },
        { status: 400 }
      );
    }

    const ext = EXT_BY_TYPE[file.type];
    const name = `cms-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

    await mkdir(IMAGE_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(IMAGE_DIR, name), buffer);

    return NextResponse.json({
      success: true,
      path: `/images/projects/${name}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
