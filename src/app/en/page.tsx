import type { Metadata } from "next";
import HomePage from "../HomePage";
import { DICT } from "@/lib/i18n";

export const revalidate = 300;

const t = DICT.en.meta;

export const metadata: Metadata = {
  title: { absolute: t.title },
  description: t.description,
  keywords: [
    "full-stack developer Cameroon",
    "web developer Douala",
    "penetration tester",
    "junior pentester",
    "cybersecurity analyst",
    "SOC analyst junior",
    "security audit",
    "web application security",
    "OWASP Top 10",
    "SaaS development",
    "e-commerce website",
    "custom web application",
    "Next.js NestJS developer",
    "freelance developer Africa",
    "David METOMO",
  ],
  alternates: {
    canonical: "/en",
    languages: { fr: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: "David René METOMO",
    title: t.title,
    description: t.ogDescription,
    images: [{ url: "/og/og-en.jpg", width: 1200, height: 630, alt: t.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: t.title,
    description: t.ogDescription,
    images: ["/og/og-en.jpg"],
  },
};

export default function HomeEn() {
  return <HomePage lang="en" />;
}
