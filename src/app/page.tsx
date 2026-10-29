import type { Metadata } from "next";
import HomePage from "./HomePage";

// Page régénérée toutes les 5 min, et immédiatement après chaque
// modification dans le CMS (revalidatePublicPages).
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
};

export default function Home() {
  return <HomePage lang="fr" />;
}
