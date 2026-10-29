import { isBlobStorageEnabled, readCmsJsonBlob, writeCmsJsonBlob } from "@/lib/cms-blob-storage";

/**
 * Limite les tentatives de connexion au CMS : 5 échecs par adresse IP sur
 * 15 minutes, puis blocage 15 minutes. L'état est gardé dans le Blob Store
 * (partagé entre les instances Vercel), avec une mémoire locale en secours.
 */
const FILE = "login-attempts.json";
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

const memory = new Map();

async function load() {
  if (isBlobStorageEnabled()) {
    try {
      return (await readCmsJsonBlob(FILE)) || {};
    } catch {
      /* secours mémoire */
    }
  }
  return Object.fromEntries(memory);
}

async function save(state) {
  const now = Date.now();
  // On ne garde que les entrées encore utiles
  const pruned = Object.fromEntries(
    Object.entries(state).filter(([, v]) => now - v.first < WINDOW_MS || v.lockedUntil > now)
  );
  memory.clear();
  for (const [k, v] of Object.entries(pruned)) memory.set(k, v);
  if (isBlobStorageEnabled()) {
    try {
      await writeCmsJsonBlob(FILE, pruned);
    } catch {
      /* la mémoire locale suffit en secours */
    }
  }
}

export function clientIp(req) {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "inconnue"
  );
}

/** Retourne le nombre de secondes de blocage restant (0 si autorisé). */
export async function lockedFor(ip) {
  const state = await load();
  const entry = state[ip];
  if (!entry?.lockedUntil) return 0;
  const left = entry.lockedUntil - Date.now();
  return left > 0 ? Math.ceil(left / 1000) : 0;
}

export async function recordFailure(ip) {
  const state = await load();
  const now = Date.now();
  let entry = state[ip];
  if (!entry || now - entry.first > WINDOW_MS) entry = { count: 0, first: now };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) entry.lockedUntil = now + WINDOW_MS;
  state[ip] = entry;
  await save(state);
}

export async function recordSuccess(ip) {
  const state = await load();
  if (state[ip]) {
    delete state[ip];
    await save(state);
  }
}
