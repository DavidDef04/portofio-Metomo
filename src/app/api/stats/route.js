import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import projectData from "@/data/projects";

const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL
? `${process.env.NEXT_PUBLIC_ANALYTICS_URL}/api/analytics`
: "http:localhost:3000/api/analytics";

export async function GET() {
  try {
    // 1. Nombre de projets
    const projectCount = projectData.filter((p) =>
      p.tag.includes("All")
    ).length;

    // 2. Gestion des visiteurs
   const analyticsRes = await fetch(ANALYTICS_URL);
   const analyticsData = await analyticsRes.json();
   const visitorCount = Number.isFinite(parseInt(analyticsData.activeUsers))
   ? parseInt(analyticsData.activeUsers) : 100;



    // 3. Années d'expérience
    const startDate = new Date("2025-01-10");
    const now = new Date();

    if (isNaN(startDate.getTime())){
      throw new Error("Date de début invalide");
    }

    const yearDiff = now.getFullYear() - startDate.getFullYear();
    const hasHadBirthday =
      now.getMonth() > startDate.getMonth() ||
      (now.getMonth() === startDate.getMonth() &&
        now.getDate() >= startDate.getDate());
    let experience = hasHadBirthday ? yearDiff : yearDiff - 1;
    experience = experience < 1 ? 1 : experience;

    return NextResponse.json({
      projects: projectCount,
      visitors: visitorData.count,
      experience: experience < 1 ? 1 : experience,
    });
  } catch (error) {
    console.error("Erreur API /api/stats :", error);
    console.error(error.stack);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
