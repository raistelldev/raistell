import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AudienceProvider } from "@/components/AudienceContext";
import { companyFunnel, site } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();
const title = `${site.name} – Authentische Creator für die Energiewende`;
const description = companyFunnel.hero.subtitle;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s – ${site.name}`,
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: site.name,
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: site.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#173042",
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
