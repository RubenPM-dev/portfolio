import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Analytics } from "@vercel/analytics/next";
import { BeamField } from "@/components/motion/beamField";
import { siteBaseUrl } from "@/lib/siteConfig";
import { isLocale, locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: "Ruben Poveda",
    template: "%s | Ruben Poveda",
  },
  description:
    "Senior iOS Engineer portfolio focused on high-scale realtime systems and product engineering.",
  openGraph: {
    title: "Ruben Poveda",
    description:
      "High-scale mobile product engineering, realtime reliability, and premium execution.",
    url: siteBaseUrl,
    siteName: "Ruben Poveda",
    type: "website",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruben Poveda",
    description:
      "Senior iOS Engineer portfolio focused on high-scale realtime product engineering.",
    images: ["/og"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <BeamField />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
