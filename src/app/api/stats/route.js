import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "494630808";

/** Début de pratique professionnelle / formation — vérité déclarée (depuis 2024) */
const CAREER_START = new Date("2024-01-01");

function calculateExperience(startDate, endDate = new Date()) {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return 0;
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  const days = endDate.getDate() - startDate.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return parseFloat((years + months / 12).toFixed(1));
}

function loadGaCredentials() {
  const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (rawJson) return JSON.parse(rawJson);

  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath) {
    const resolved = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    return JSON.parse(fs.readFileSync(resolved, "utf-8"));
  }

  return null;
}

async function fetchTotalUsersGA4() {
  let credentials;
  try {
    credentials = loadGaCredentials();
  } catch {
    console.error("Impossible de lire les identifiants Google Analytics.");
    return 0;
  }

  if (!credentials) {
    console.error(
      "GA4 : définir GOOGLE_APPLICATION_CREDENTIALS_JSON ou GOOGLE_APPLICATION_CREDENTIALS"
    );
    return 0;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  const analyticsDataClient = google.analyticsdata({
    version: "v1beta",
    auth,
  });

  try {
    const response = await analyticsDataClient.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
        metrics: [{ name: "totalUsers" }],
      },
    });

    const totalUsers = parseInt(
      response.data.rows?.[0]?.metricValues?.[0]?.value || "0",
      10
    );
    return Number.isFinite(totalUsers) ? totalUsers : 0;
  } catch (error) {
    console.error("Erreur GA4:", error);
    return 0;
  }
}

export async function GET() {
  try {
    const visitorCount = await fetchTotalUsersGA4();
    const experienceYears = calculateExperience(CAREER_START);

    return NextResponse.json({
      visitors: visitorCount,
      experience: experienceYears,
      experienceSince: "2024",
    });
  } catch (error) {
    console.error("Erreur API /api/stats :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
