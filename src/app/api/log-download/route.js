export async function POST(request) {
  // Tu peux récupérer infos IP, user agent, timestamp
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  // Ici tu peux stocker ça dans une base de données ou fichier (exemple simple : console.log)
  console.log(`CV download logged: ${timestamp}, IP: ${ip}, UA: ${userAgent}`);

  // Tu peux aussi stocker dans une base externe (ex: Supabase, MongoDB, Google Sheets...)

  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
