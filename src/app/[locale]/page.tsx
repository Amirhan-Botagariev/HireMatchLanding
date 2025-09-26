import { getDictionary } from "@/app/i18n/dictionaries";
import { locales, defaultLocale, type Locale } from "@/app/i18n/config";
import HomeClient from "@/app/components/HomeClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function toLocale(value: string): Locale {
  return (locales as readonly string[]).includes(value) ? (value as Locale) : defaultLocale;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = toLocale(raw);
  const dict = await getDictionary(locale);

  return <HomeClient locale={locale} dict={dict} />;
}