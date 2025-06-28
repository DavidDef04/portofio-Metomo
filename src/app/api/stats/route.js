import { NextResponse } from "next/server";
import projectData from "@/data/projects";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Initialisation du client GA4 avec le fichier de clé JSON
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFile: "secrets/ga4-service-account.json", 
});

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Fonction pour calculer les années d'expérience à partir d'une date
function calculateExperience(startDate, endDate = new Date()) {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new Error("Date de début invalide");
  }

  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    endDate = new Date();
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

// Fonction pour récupérer le total d’utilisateurs sur toute la durée
async function fetchTotalUsersGA4() {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      metrics: [{ name: "totalUsers" }],
    });

    if (response.rows && response.rows.length > 0) {
      const totalUsers = parseInt(response.rows[0].metricValues[0].value, 10);
      return Number.isFinite(totalUsers) ? totalUsers : 0;
    }

    return 0;
  } catch (error) {
    console.error("Erreur récupération visiteurs GA4 :", error);
    return 0;
  }
}

export async function GET() {
  try {
    // Nombre de projets 
    const projectCount = projectData.filter((p) =>
      p.tag.includes("All")
    ).length;

    // Visiteurs depuis Google Analytics
    const visitorCount = await fetchTotalUsersGA4();

    // Années d'expérience depuis fin formation
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
