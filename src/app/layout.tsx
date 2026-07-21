import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InitialLoader from "@/components/InitialLoader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ConsentBanner from "@/components/ConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://www.sobup.online";
const SITE_NAME = "SOBUP — Société Burkinabè de Pneumologie";
const SITE_DESCRIPTION =
  "La SOBUP est la société savante de référence en santé respiratoire au Burkina Faso. Formation, recherche, recommandations et plaidoyer pour la pneumologie.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · SOBUP",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "pneumologie", "Burkina Faso", "SOBUP", "santé respiratoire",
    "tuberculose", "asthme", "BPCO", "société savante", "Ouagadougou",
  ],
  applicationName: "SOBUP",
  authors: [{ name: "Société Burkinabè de Pneumologie" }],
  creator: "SOBUP",
  publisher: "SOBUP",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "SOBUP",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Logo SOBUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "vZb-jr2Z1a8bp-44LgvF00VkC9czR7TTrtgVQ-cYndM",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "Société Burkinabè de Pneumologie",
  alternateName: "SOBUP",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  foundingDate: "2011",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ouagadougou",
    addressCountry: "BF",
    streetAddress: "Service de Pneumologie, CHU Yalgado Ouédraogo",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "sobup01@gmail.com",
    availableLanguage: ["French"],
  },
  medicalSpecialty: "Pulmonary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background antialiased">
        {/* JSON-LD Schema.org — permet à Google d'afficher le logo SOBUP dans les résultats */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <InitialLoader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <ConsentBanner />
      </body>
    </html>
  );
}
