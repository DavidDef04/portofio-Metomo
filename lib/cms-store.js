import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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

async function readJson(filename, fallback) {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return typeof fallback === "function" ? fallback() : fallback;
  }
}

async function writeJson(filename, data) {
  await ensureCmsDir();
  const filePath = path.join(CMS_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
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
