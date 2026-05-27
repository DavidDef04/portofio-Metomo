import { unlink, readdir } from "fs/promises";
import path from "path";
import { isBlobAssetUrl, deleteBlobAsset } from "@/lib/cms-blob-storage";

const PUBLIC_ROOT = path.join(process.cwd(), "public");
export const CV_STABLE_PATH = "/cv/David_Rene_Metomo_CV.pdf";
const CV_DIR = path.join(PUBLIC_ROOT, "cv");

/** Chemins gérés par le CMS et remplaçables à l'upload */
export function isReplaceableCmsAsset(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return false;
  const p = urlPath.split("?")[0];
  if (isBlobAssetUrl(p)) return true;
  if (p.startsWith("/images/projects/cms-")) return true;
  if (/^\/CV_\d+\.pdf$/i.test(p)) return true;
  if (p === CV_STABLE_PATH) return true;
  return false;
}

export function publicUrlToAbsolute(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return null;
  const normalized = urlPath.split("?")[0];
  if (!normalized.startsWith("/") || normalized.includes("..")) return null;
  const abs = path.normalize(path.join(PUBLIC_ROOT, normalized.slice(1)));
  if (!abs.startsWith(PUBLIC_ROOT)) return null;
  return abs;
}

export async function deletePublicAssetIfManaged(urlPath) {
  if (!isReplaceableCmsAsset(urlPath)) return;
  const p = urlPath.split("?")[0];
  if (isBlobAssetUrl(p)) {
    await deleteBlobAsset(p);
    return;
  }
  const abs = publicUrlToAbsolute(urlPath);
  if (!abs) return;
  try {
    await unlink(abs);
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.warn("Suppression fichier CMS:", urlPath, e.message);
    }
  }
}

/** Supprime les anciens CV timestampés à la racine de public/ */
export async function cleanupOrphanCvFiles(keepPath = CV_STABLE_PATH) {
  try {
    const files = await readdir(PUBLIC_ROOT);
    for (const name of files) {
      if (/^CV_\d+\.pdf$/i.test(name)) {
        const url = `/${name}`;
        if (url !== keepPath) {
          await deletePublicAssetIfManaged(url);
        }
      }
    }
  } catch {
    /* ignore */
  }
}

export { CV_DIR, PUBLIC_ROOT };
