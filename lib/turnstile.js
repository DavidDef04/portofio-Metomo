export async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY manquant");
    return false;
  }
  if (!token) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteip) body.append("remoteip", remoteip);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  );
  const data = await res.json();
  return data.success === true;
}
