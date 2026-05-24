import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "cms_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function getSecret() {
  return process.env.CMS_AUTH_SECRET || process.env.ADMIN_PASSWORD || "change-me";
}

function envTrim(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function isCmsConfigured() {
  return Boolean(envTrim(process.env.ADMIN_PASSWORD));
}

export function verifyAdminCredentials(username, password) {
  const adminUser = envTrim(process.env.ADMIN_USERNAME) || "admin";
  const adminPass = envTrim(process.env.ADMIN_PASSWORD);
  if (!adminPass) return false;
  const user = envTrim(username);
  const pass = typeof password === "string" ? password : "";
  return user === adminUser && pass === adminPass;
}

function signPayload(payload) {
  const secret = getSecret();
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token) {
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(body)
      .digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession() {
  const payload = { role: "admin", exp: Date.now() + MAX_AGE * 1000 };
  const token = signPayload(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return Boolean(verifyToken(token));
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    const err = new Error("Non autorisé");
    err.status = 401;
    throw err;
  }
}
