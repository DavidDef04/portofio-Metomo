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
import HtmlLang from "./components/HtmlLang";
import Tracker from "./components/Tracker";
import { getMergedProjects } from "@/lib/projects-merge";
import { getCertifications } from "@/lib/cms-store";
import { getPublicSiteContent } from "@/lib/site-content";
import { localizeList } from "@/lib/i18n";

type Lang = "fr" | "en";

async function loadInitialData(lang: Lang) {
  try {
    const [projects, certs, siteContent] = await Promise.all([
      // Projets du CMS uniquement : rapide, et présents dans le HTML pour Google.
      getMergedProjects({ skipGithub: true, forPublic: true, lang }),
      getCertifications(),
      getPublicSiteContent(lang),
    ]);
    return {
      hero: siteContent?.hero,
      about: siteContent?.about,
      experiences: siteContent?.experiences,
      education: siteContent?.education,
      projects,
      certifications: localizeList(certs || [], lang)
        .filter((c: { visible?: boolean }) => c.visible !== false)
        .sort(
          (a: { order?: number }, b: { order?: number }) =>
            (a.order ?? 999) - (b.order ?? 999)
        ),
    };
  } catch (e) {
    console.error("Chargement initial de la page :", e);
    return { projects: [], certifications: [] };
  }
}

export default async function HomePage({ lang }: { lang: Lang }) {
  const data = await loadInitialData(lang);

  return (
    <ModernPreloader>
      <HtmlLang lang={lang} />
      <Tracker lang={lang} />
      <main className="relative min-h-screen bg-void overflow-x-hidden">
        <PremiumNav lang={lang} />
        <ModernHeroSection lang={lang} initialHero={data.hero} />
        <ModernProjectSection lang={lang} initialProjects={data.projects} />
        <AchievementsSection lang={lang} />
        <ModernAboutSection
          lang={lang}
          initialCertifications={data.certifications}
          initialAbout={data.about}
          initialExperiences={data.experiences}
          initialEducation={data.education}
        />
        <ModernEmailSection lang={lang} />
        <ModernScrollToTopButton lang={lang} />
        <WhatsAppButton lang={lang} />
        <ModernFooter lang={lang} />
      </main>
    </ModernPreloader>
  );
}
