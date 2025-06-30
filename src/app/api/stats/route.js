import { NextResponse } from "next/server";
import projectData from "@/data/projects";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"];
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "494630808";

function calculateExperience(startDate, endDate = new Date()) {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error("Date de début invalide");
  }

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return parseFloat((years + months / 12).toFixed(2));
}

async function fetchTotalUsersGA4() {
  const rawJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!rawJson) {
    console.error("Clé JSON manquante dans les variables d’environnement.");
    return 0;
  }

  const credentials = JSON.parse(rawJson);

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

    const totalUsers = parseInt(response.data.rows?.[0]?.metricValues?.[0]?.value || "0", 10);
    return Number.isFinite(totalUsers) ? totalUsers : 0;
  } catch (error) {
    console.error("Erreur GA4:", error);
    return 0;
  }
}

export async function GET() {
  try {
    const projectCount = projectData.filter((p) => p.tag.includes("All")).length;
    const visitorCount = await fetchTotalUsersGA4();

    const finFormation = new Date("2024-10-10");
    const experience = calculateExperience(finFormation);

    return NextResponse.json({
      visitors: visitorCount,
      experience: experience < 1 ? 1 : experience,
    });
  } catch (error) {
    console.error("Erreur API /api/stats :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
