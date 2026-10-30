import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Syne, Albert_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const albert = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["italic"],
  weight: ["400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://portofio-metomo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "David René METOMO — Développeur full-stack & cybersécurité",
    template: "%s | David METOMO",
  },
  description:
    "Développeur full-stack et junior en cybersécurité à Douala. Plateformes SaaS, sites web, API (Next.js, NestJS, Laravel, Django), SEO, déploiement. Certifié Google Cybersecurity.",
  keywords: [
    "développeur full-stack Douala",
    "développeur web Cameroun",
    "SEO référencement",
    "Laravel Django PHP",
    "Next.js NestJS",
    "cybersécurité Cameroun",
    "pentest junior Douala",
    "pentester Cameroun",
    "test d'intrusion",
    "audit de sécurité site web",
    "analyste cybersécurité",
    "analyste SOC junior",
    "sécurité applicative",
    "OWASP Top 10",
    "création site web Douala",
    "site e-commerce Cameroun",
    "développement SaaS",
    "application sur mesure Cameroun",
    "full-stack developer Cameroon",
    "penetration tester",
    "David METOMO",
  ],
  authors: [{ name: "David René METOMO", url: siteUrl }],
  creator: "David René METOMO",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: siteUrl,
    siteName: "David René METOMO",
    title: "David René METOMO — Développeur full-stack & cybersécurité",
    description:
      "Développeur full-stack qui pense sécurité : plateformes SaaS, sites web, API et déploiement. Basé à Douala.",
    images: [
      {
        url: "/og/og-fr.jpg",
        width: 1200,
        height: 630,
        alt: "David René METOMO — Développeur full-stack & cybersécurité",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David René METOMO — Développeur full-stack & cybersécurité",
    description:
      "Développeur full-stack et cybersécurité — Next.js, NestJS, Laravel, Django, SEO, déploiement.",
    images: ["/og/og-fr.jpg"],
  },
  robots: { index: true, follow: true },
  // Validation du site dans Google Search Console (balise publique)
  verification: { google: "eR8ipWoJQpA-3BT-Lq2uK7QaIH-mmq-xQdW36eLpcqs" },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David René METOMO",
  jobTitle: "Développeur full-stack & cybersécurité",
  description:
    "Développeur full-stack et cybersécurité à Douala : plateformes SaaS, sites web, API et déploiement. Certifié Google Cybersecurity.",
  image: `${siteUrl}/images/image.png`,
  knowsLanguage: ["fr", "en"],
  url: siteUrl,
  email: "metomo442@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Douala",
    addressCountry: "CM",
  },
  sameAs: [
    "https://github.com/DavidDef04",
    "https://www.linkedin.com/in/david-ren%C3%A9-metomo-elogo-5b0432314",
  ],
  knowsAbout: [
    "Django",
    "Laravel",
    "PHP",
    "JavaScript",
    "TypeScript",
    "Next.js",
    "NestJS",
    "SEO",
    "Cybersécurité",
    "Tests d'intrusion",
    "Analyse de vulnérabilités",
    "OWASP Top 10",
    "SIEM",
    "Sécurité applicative",
  ],
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "Google Cybersecurity Professional Certificate",
    credentialCategory: "certificate",
    recognizedBy: { "@type": "Organization", name: "Google" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${albert.variable} ${newsreader.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J2WJ9P98FB"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-J2WJ9P98FB');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="grain antialiased bg-void text-bone-dim">
        <ClientWrapper>{children}</ClientWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
