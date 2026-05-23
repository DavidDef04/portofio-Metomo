import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/cms-auth";
import {
  CV_STABLE_PATH,
  CV_DIR,
  cleanupOrphanCvFiles,
  deletePublicAssetIfManaged,
  publicUrlToAbsolute,
} from "@/lib/cms-files";

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

export async function POST(req) {
  try {
    await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");
    const kind = formData.get("kind") === "cv" ? "cv" : "image";
    const previousPath =
      typeof formData.get("previousPath") === "string"
        ? formData.get("previousPath").trim()
        : "";

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

      if (previousPath && previousPath !== CV_STABLE_PATH) {
        await deletePublicAssetIfManaged(previousPath);
      }

      await mkdir(CV_DIR, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      const absPath = publicUrlToAbsolute(CV_STABLE_PATH);
      await writeFile(absPath, buffer);
      await cleanupOrphanCvFiles();

      return NextResponse.json({
        success: true,
        path: CV_STABLE_PATH,
        replaced: true,
      });
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

    if (previousPath) {
      await deletePublicAssetIfManaged(previousPath);
    }

    const ext = EXT_BY_TYPE[file.type];
    const name = `cms-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

    await mkdir(IMAGE_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(IMAGE_DIR, name), buffer);

    return NextResponse.json({
      success: true,
      path: `/images/projects/${name}`,
      replaced: Boolean(previousPath),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status || 500 }
    );
  }
}
