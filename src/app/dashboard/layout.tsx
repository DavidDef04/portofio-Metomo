import type { Metadata } from "next";

// Espace d'administration : jamais indexé par les moteurs de recherche
export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
