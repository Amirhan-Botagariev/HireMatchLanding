import { getDictionary } from "@/app/i18n/dictionaries";
import { locales, type Locale } from "@/app/i18n/config";
import HomeClient from "@/app/components/HomeClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function unwrapParams<T>(p: T | Promise<T>): Promise<T> {
  return p as any;
}

export default async function Page({
  params,
}: {
  params: { locale: Locale } | Promise<{ locale: Locale }>;
}) {
  const { locale } = await unwrapParams(params); // <-- обязательно await
  const [dict] = await Promise.all([getDictionary(locale)]);

  return <HomeClient locale={locale} dict={dict} />;
}