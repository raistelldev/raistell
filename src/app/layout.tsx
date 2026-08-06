import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AudienceProvider } from "@/components/AudienceContext";
import { companyFunnel, site } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${site.name} – Authentische Creator für die Energiewende`,
  description: companyFunnel.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AudienceProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieBanner />
        </AudienceProvider>
      </body>
    </html>
  );
}
