import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(payload, signature) {
  if (!WEBHOOK_SECRET || !signature) return false;
  const sig = signature.replace(/^sha256=/, "");
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/**
 * Configure sur GitHub : Settings → Webhooks → Push events
 * URL : https://votre-domaine.com/api/github/webhook
 * Secret : GITHUB_WEBHOOK_SECRET (même valeur dans .env)
 */
export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");

  if (WEBHOOK_SECRET && !verifySignature(payload, signature)) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  if (event === "push" || event === "repository") {
    revalidateTag("github-projects");
    console.log(
      `GitHub webhook [${event}] — cache projets invalidé pour ${data.repository?.full_name || "repo"}`
    );
  }

  return NextResponse.json({ ok: true, revalidated: event === "push" });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Webhook GitHub actif. Envoyez des événements push ici.",
  });
}
