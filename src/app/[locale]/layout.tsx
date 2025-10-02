// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { locales, defaultLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/dictionaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = "https://fastmatch.me";

// ✅ делаем async и деструктурируем params через await
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale =
    (["ru", "en", "kz"] as const).includes(raw as any) ? (raw as Locale) : "ru";

  const dict = getDictionary(locale);

  const title =
    locale === "en"
      ? "FastMatch — automate job applications with AI"
      : locale === "kz"
      ? "FastMatch — ЖИ көмегімен өтінімдерді автоматтандыр"
      : "FastMatch — Автоматизация откликов для соискателей";

  const hrefs = {
    ru: `${SITE_URL}/ru`,
    en: `${SITE_URL}/en`,
    kz: `${SITE_URL}/kz`,
  };

  const ogLocale =
    locale === "en" ? "en_US" : locale === "kz" ? "kk_KZ" : "ru_RU";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    alternates: {
      canonical: hrefs[locale],
      languages: {
        en: hrefs.en,
        ru: hrefs.ru,
        kk: hrefs.kz,
        "x-default": SITE_URL,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      siteName: "FastMatch",
      title,
      locale: ogLocale,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/og.png"],
    },
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2f84ff" },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = { themeColor: "#0f1220" };

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

function toLocale(value: string): Locale {
  return (locales as readonly string[]).includes(value) ? (value as Locale) : defaultLocale;
}

// ✅ тоже async и ждем params
export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FastMatch",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/apple-touch-icon.png`,
  };

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-base-950 text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}