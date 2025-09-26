import { getDictionary } from "@/app/i18n/dictionaries";
import type { Locale } from "@/app/i18n/config";
import HomeClient from "@/app/components/HomeClient";

export default async function Page({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return <HomeClient locale={params.locale} dict={dict} />;
}