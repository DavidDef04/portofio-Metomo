import Script from "next/script";
import type { Metadata, Viewport } from "next";
import { Syne, Albert_Sans, Newsreader } from "next/font/google";
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://david-metomo.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "David René METOMO — Développeur full-stack",
    template: "%s | David METOMO",
  },
  description:
    "Développeur full-stack à Douala (ALC Digital). Sites web, SEO, déploiement, Django, Laravel, PHP, JavaScript, SQL, n8n et automatisation.",
  keywords: [
    "développeur full-stack Douala",
    "développeur web Cameroun",
    "SEO référencement",
    "Laravel Django PHP",
    "David METOMO",
  ],
  authors: [{ name: "David René METOMO", url: siteUrl }],
  creator: "David René METOMO",
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: siteUrl,
    siteName: "METOMO Studio",
    title: "David René METOMO — Expériences digitales premium",
    description:
      "Développeur full-stack — sites web, SEO, déploiement et automatisation. Basé à Douala.",
    images: [
      {
        url: "/images/image.png",
        width: 1200,
        height: 630,
        alt: "David René METOMO — Portfolio premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David René METOMO — Studio digital premium",
    description:
      "Développeur full-stack — Django, Laravel, PHP, JS, SEO, déploiement, n8n.",
    images: ["/images/image.png"],
  },
  robots: { index: true, follow: true },
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
  jobTitle: "Développeur Full-Stack",
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
    "SEO",
    "Cybersécurité",
  ],
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
      </body>
    </html>
  );
}
