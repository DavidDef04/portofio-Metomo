import { NextResponse } from "next/server";

/** Début de pratique professionnelle — vérité déclarée (depuis 2024) */
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

export async function GET() {
  try {
    const experienceYears = calculateExperience(CAREER_START);

    return NextResponse.json({
      experience: experienceYears,
      experienceSince: "2024",
    });
  } catch (error) {
    console.error("Erreur API /api/stats :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
