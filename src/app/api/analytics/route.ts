import { NextResponse } from "next/server";
import { google } from "googleapis";
import path from "path";
import fs from "fs";

const KEYFILEPATH = path.join(process.cwd(), "secrets", "ga4-service-account.json");
const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];
const PROPERTY_ID = "494630808";

export async function GET() {
  try {
    const keyFile = JSON.parse(fs.readFileSync(KEYFILEPATH, "utf-8"));
    console.log("Key file loaded:", keyFile.client_email);

    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
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

    console.log("GA4 response:", response.data);

    return NextResponse.json({
      activeUsers: response.data.rows?.[0]?.metricValues?.[0]?.value || 0,
    });
  } catch (error) {
    console.error("Erreur API GA4:", error.response?.data || error.message || error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
