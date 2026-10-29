import PremiumNav from "./components/PremiumNav";
import ModernHeroSection from "./components/ModernHeroSection";
import ModernAboutSection from "./components/ModernAboutSection";
import ModernProjectSection from "./components/ModernProjectSection";
import ModernEmailSection from "./components/ModernEmailSection";
import ModernFooter from "./components/ModernFooter";
import AchievementsSection from "./components/AchievementsSection";
import ModernPreloader from "./components/ModernPreloader";
import ModernScrollToTopButton from "./components/ModernScrollToTopButton";
import WhatsAppButton from "./components/WhatsAppButton";
import { getMergedProjects } from "@/lib/projects-merge";
import { getCertifications } from "@/lib/cms-store";
import { getPublicSiteContent } from "@/lib/site-content";

// Page régénérée toutes les 5 min, et immédiatement après chaque
// modification dans le CMS (revalidatePublicPages).
export const revalidate = 300;

async function loadInitialData() {
  try {
    const [projects, certs, siteContent] = await Promise.all([
      // Projets du CMS uniquement : rapide, et présents dans le HTML pour Google.
      getMergedProjects({ skipGithub: true, forPublic: true }),
      getCertifications(),
      getPublicSiteContent(),
    ]);
    return {
      hero: siteContent?.hero,
      projects,
      certifications: (certs || [])
        .filter((c: { visible?: boolean }) => c.visible !== false)
        .sort(
          (a: { order?: number }, b: { order?: number }) =>
            (a.order ?? 999) - (b.order ?? 999)
        ),
    };
  } catch (e) {
    console.error("Chargement initial de la page :", e);
    return { hero: undefined, projects: [], certifications: [] };
  }
}

export default async function Home() {
  const { hero, projects, certifications } = await loadInitialData();

  return (
    <ModernPreloader>
      <main className="relative min-h-screen bg-void overflow-x-hidden">
        <PremiumNav />
        <ModernHeroSection initialHero={hero} />
        <ModernProjectSection initialProjects={projects} />
        <AchievementsSection />
        <ModernAboutSection initialCertifications={certifications} />
        <ModernEmailSection />
        <ModernScrollToTopButton />
        <WhatsAppButton />
        <ModernFooter />
      </main>
    </ModernPreloader>
  );
}
