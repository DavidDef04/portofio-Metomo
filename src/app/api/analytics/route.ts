import { NextResponse } from "next/server";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];
const PROPERTY_ID = "494630808"; // ou process.env.GA4_PROPERTY_ID

export async function GET() {
  try {
    const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

    if (!rawJson) {
      console.error("Clé JSON non trouvée dans les variables d’environnement.");
      return NextResponse.json({ error: "Clé JSON manquante" }, { status: 500 });
    }

    const credentials = JSON.parse(rawJson);
    console.log("Service account email:", credentials.client_email);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    const activeUsers = Number(response.data.rows?.[0]?.metricValues?.[0]?.value) || 0;
    console.log("Utilisateurs actifs (7 derniers jours):", activeUsers);

    return NextResponse.json({ activeUsers });
  } catch (error: any) {
    console.error("Erreur API GA4:", error.response?.data || error.message || error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
