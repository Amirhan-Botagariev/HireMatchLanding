// src/app/[locale]/page.tsx
import { getDictionary } from "@/app/i18n/dictionaries";
import { locales, type Locale } from "@/app/i18n/config";
import HomeClient from "@/app/components/HomeClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [dict] = await Promise.all([getDictionary(locale)]);

  return <HomeClient locale={locale} dict={dict} />;
}