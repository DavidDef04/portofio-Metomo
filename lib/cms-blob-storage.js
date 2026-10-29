import { put, get, del } from "@vercel/blob";

const CMS_PREFIX = "cms-data/";

export function isBlobStorageEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function cmsRequiresBlobOnVercel() {
  return process.env.VERCEL === "1" && !isBlobStorageEnabled();
}

function blobPath(filename) {
  return `${CMS_PREFIX}${filename}`;
}

/** Lecture d'un fichier téléversé (route /api/media) */
export async function readMediaBlob(pathname) {
  if (!isBlobStorageEnabled()) return null;
  try {
    const result = await get(pathname, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    return result;
  } catch (e) {
    if (e?.name === "BlobNotFoundError") return null;
    throw e;
  }
}

export async function readCmsJsonBlob(filename) {
  if (!isBlobStorageEnabled()) return null;

  const pathname = blobPath(filename);
  try {
    // useCache: false — lecture à la source, pas dans le cache CDN.
    // Sans ça, une écriture suivie d'une relecture obtient l'ancienne
    // version, et l'écriture suivante écrase la précédente.
    const result = await get(pathname, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text);
  } catch (e) {
    if (e?.name === "BlobNotFoundError") return null;
    console.warn(`Blob read ${pathname}:`, e.message);
    return null;
  }
}

export async function writeCmsJsonBlob(filename, data) {
  if (!isBlobStorageEnabled()) {
    const err = new Error(
      "Stockage CMS indisponible : ajoutez un Blob Store Vercel au projet (BLOB_READ_WRITE_TOKEN)."
    );
    err.status = 503;
    throw err;
  }

  const pathname = blobPath(filename);
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

export const MEDIA_ROUTE_PREFIX = "/api/media/";

/**
 * Upload binaire (images, CV). Le Blob Store est privé : le fichier est
 * stocké en accès privé et servi par la route /api/media/[...path].
 * Retourne ce chemin local, utilisable directement dans <img src>.
 */
export async function uploadPublicBlob(pathname, buffer, contentType) {
  if (!isBlobStorageEnabled()) {
    const err = new Error(
      "Téléversement indisponible en production sans Vercel Blob. Voir VERCEL-CONFIGURATION.md."
    );
    err.status = 503;
    throw err;
  }

  await put(pathname, buffer, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return `${MEDIA_ROUTE_PREFIX}${pathname}`;
}

export async function deleteBlobAsset(urlOrPathname) {
  if (!urlOrPathname || !isBlobStorageEnabled()) return;
  const target = urlOrPathname.startsWith(MEDIA_ROUTE_PREFIX)
    ? urlOrPathname.slice(MEDIA_ROUTE_PREFIX.length)
    : urlOrPathname;
  try {
    await del(target);
  } catch (e) {
    if (e?.name !== "BlobNotFoundError") {
      console.warn("Blob delete:", urlOrPathname, e.message);
    }
  }
}

export function isBlobAssetUrl(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return false;
  return (
    urlPath.includes(".blob.vercel-storage.com") ||
    urlPath.startsWith(MEDIA_ROUTE_PREFIX)
  );
}
