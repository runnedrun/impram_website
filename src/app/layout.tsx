import type { Metadata } from "next";
import { Limelight, Poppins } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { defaultMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const limelight = Limelight({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-limelight",
});

export const metadata: Metadata = defaultMetadata;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "PerformingGroup",
  name: "Impram",
  url: "https://impram.net",
  description: "Improv in Gothenburg",
  sameAs: [
    "https://www.facebook.com/ImpramImprov/",
    "https://www.instagram.com/impramgbg/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${limelight.variable} h-full`}>
      <body className="flex min-h-full flex-col font-[family-name:var(--font-poppins)] antialiased">
        <JsonLd data={organizationJsonLd} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
