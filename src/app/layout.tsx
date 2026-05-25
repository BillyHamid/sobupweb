import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOBUP — Société Burkinabè de Pneumologie",
  description:
    "La SOBUP est la société savante de référence en santé respiratoire au Burkina Faso. Formation, recherche, recommandations et plaidoyer pour la pneumologie.",
  keywords:
    "pneumologie, Burkina Faso, SOBUP, santé respiratoire, tuberculose, asthme, BPCO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
