import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { locales, type Locale } from "@/app/i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "HireMatch — Автоматизация откликов для соискателей",
  description:
    "ИИ анализирует резюме и автоматически отправляет персонализированные заявки на вакансии — для всех, кто ищет работу.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2f84ff" }],
  },
};

export const viewport: Viewport = { themeColor: "#0f1220" };

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

async function unwrapParams<T>(p: T | Promise<T>): Promise<T> {
  return p as any;
}

export default async function LocaleLayout({
  params,
  children,
}: {
  params: { locale: Locale } | Promise<{ locale: Locale }>;
  children: React.ReactNode;
}) {
  const { locale } = await unwrapParams(params);

  return (
    <html lang={locale} className={inter.variable}>
      <body className="bg-base-950 text-white antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}