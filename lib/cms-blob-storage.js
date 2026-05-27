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

export async function readCmsJsonBlob(filename) {
  if (!isBlobStorageEnabled()) return null;

  const pathname = blobPath(filename);
  try {
    const result = await get(pathname, { access: "private" });
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
  });
}

/** Upload binaire (images, CV) — URL publique pour affichage sur le site */
export async function uploadPublicBlob(pathname, buffer, contentType) {
  if (!isBlobStorageEnabled()) {
    const err = new Error(
      "Téléversement indisponible en production sans Vercel Blob. Voir VERCEL-CONFIGURATION.md."
    );
    err.status = 503;
    throw err;
  }

  const result = await put(pathname, buffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return result.url;
}

export async function deleteBlobAsset(urlOrPathname) {
  if (!urlOrPathname || !isBlobStorageEnabled()) return;
  try {
    await del(urlOrPathname);
  } catch (e) {
    if (e?.name !== "BlobNotFoundError") {
      console.warn("Blob delete:", urlOrPathname, e.message);
    }
  }
}

export function isBlobAssetUrl(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return false;
  return urlPath.includes(".blob.vercel-storage.com");
}
