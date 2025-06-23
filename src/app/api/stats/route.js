import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import projectData from "@/data/projects";

const visitorsPath = path.join(process.cwd(), "data", "visitors.json");

export async function GET() {
  try {
    // 1. Nombre de projets
    const projectCount = projectData.filter((p) =>
      p.tag.includes("All")
    ).length;

    // 2. Gestion des visiteurs
    let visitorData;
    if (!fs.existsSync(visitorsPath)) {
      // Crée le fichier s'il n'existe pas
      visitorData = { count: 0 };
      fs.writeFileSync(visitorsPath, JSON.stringify(visitorData));
    } else {
      visitorData = JSON.parse(fs.readFileSync(visitorsPath, "utf-8"));
    }

    visitorData.count = (visitorData.count || 0) + 1;
    fs.writeFileSync(visitorsPath, JSON.stringify(visitorData));

    // 3. Années d'expérience
    const startDate = new Date("2025-01-10");
    const now = new Date();
    const yearDiff = now.getFullYear() - startDate.getFullYear();
    const hasHadBirthday =
      now.getMonth() > startDate.getMonth() ||
      (now.getMonth() === startDate.getMonth() &&
        now.getDate() >= startDate.getDate());
    const experience = hasHadBirthday ? yearDiff : yearDiff - 1;

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
