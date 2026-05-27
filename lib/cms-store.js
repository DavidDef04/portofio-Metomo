import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  isBlobStorageEnabled,
  cmsRequiresBlobOnVercel,
  readCmsJsonBlob,
  writeCmsJsonBlob,
} from "@/lib/cms-blob-storage";

const CMS_DIR = path.join(process.cwd(), "data", "cms");

const FILES = {
  manualProjects: "manual-projects.json",
  certifications: "certifications.json",
  githubMeta: "github-meta.json",
  siteContent: "site-content.json",
};

async function ensureCmsDir() {
  await fs.mkdir(CMS_DIR, { recursive: true });
}

async function readJsonFs(filename) {
  const filePath = path.join(CMS_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

async function writeJsonFs(filename, data) {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function readJson(filename, fallback) {
  if (isBlobStorageEnabled()) {
    const fromBlob = await readCmsJsonBlob(filename);
    if (fromBlob !== null) return fromBlob;
  }

  const fromFs = await readJsonFs(filename);
  if (fromFs !== null) return fromFs;

  return typeof fallback === "function" ? fallback() : fallback;
}

async function writeJson(filename, data) {
  if (isBlobStorageEnabled()) {
    await writeCmsJsonBlob(filename, data);
    return;
  }

  if (cmsRequiresBlobOnVercel()) {
    const err = new Error(
      "Impossible d'enregistrer en production : le disque Vercel est en lecture seule. Créez un Blob Store (Storage → Blob) et reliez-le au projet, puis redéployez."
    );
    err.status = 503;
    throw err;
  }

  await writeJsonFs(filename, data);
}

export async function getManualProjects() {
  return readJson(FILES.manualProjects, []);
}

export async function saveManualProjects(projects) {
  await writeJson(FILES.manualProjects, projects);
}

export async function getCertifications() {
  return readJson(FILES.certifications, []);
}

export async function saveCertifications(items) {
  await writeJson(FILES.certifications, items);
}

export async function getGithubMeta() {
  return readJson(FILES.githubMeta, {});
}

export async function saveGithubMeta(meta) {
  await writeJson(FILES.githubMeta, meta);
}

export async function getSiteContent() {
  return readJson(FILES.siteContent, null);
}

export async function saveSiteContent(data) {
  await writeJson(FILES.siteContent, data);
}

export function newId() {
  return randomUUID();
}
