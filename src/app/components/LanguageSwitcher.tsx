"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import Cookies from "js-cookie";
import { locales, type Locale } from "@/app/i18n/config";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (target: Locale) => {
    if (!pathname) return;
    const parts = pathname.split("/");
    parts[1] = target;
    const newPath = parts.join("/") || `/${target}`;
    Cookies.set("NEXT_LOCALE", target, { expires: 365, path: "/" });
    startTransition(() => router.push(newPath));
  };

  return (
    <div className="flex gap-2">
      {locales.map((lng) => (
        <button
          key={lng}
          onClick={() => switchTo(lng)}
          disabled={isPending || lng === locale}
          className={`rounded-full border border-white/10 px-3 py-1 text-xs font-semibold ${
            lng === locale ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/5"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}