export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  console.log(`CV download logged: ${timestamp}, IP: ${ip}, UA: ${userAgent}`);


  return new Response(JSON.stringify({ status: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
