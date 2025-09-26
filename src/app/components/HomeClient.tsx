"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import type { Locale } from "@/app/i18n/config";

type Dict = any;

export default function HomeClient({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [btnText, setBtnText] = useState<string>(dict.cta.submit);
  const [shake, setShake] = useState(false);
  const [announce, setAnnounce] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const clearError = useCallback(() => setError(null), []);
  const showError = useCallback(
    (msg = dict.cta.error) => {
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setAnnounce(msg);
    },
    [dict.cta.error]
  );

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (href.startsWith("#") && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const buildTracking = useCallback(() => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    return {
      referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
      utm: qs || "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      locale,
      tzOffsetMin: new Date().getTimezoneOffset(),
    };
  }, [locale]);

  const validateAndSubmit = useCallback(async () => {
    const trimmed = email.trim();
    if (!emailRegex.test(trimmed)) {
      showError();
      return;
    }
    clearError();
    setSubmitting(true);
    setBtnText(dict.cta.sending);

    const payload = Object.assign({ email: trimmed }, buildTracking());
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setBtnText(dict.cta.done);
      setAnnounce(res.ok ? "ok" : "error");
      if (res.ok) setEmail("");
    } catch {
      setBtnText(dict.cta.done);
      setAnnounce("network-error");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
        setBtnText(dict.cta.submit);
      }, 2000);
    }
  }, [email, emailRegex, clearError, showError, buildTracking, dict.cta.sending, dict.cta.done, dict.cta.submit]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      validateAndSubmit();
    },
    [validateAndSubmit]
  );

  useEffect(() => {
    if (error && emailInputRef.current) emailInputRef.current.focus();
  }, [error]);

  return (
    <main suppressHydrationWarning>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#top" onClick={handleAnchorClick} className="text-xl font-extrabold tracking-tight">
            Hire<span className="text-brand-400">Match</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <a href="#how" onClick={handleAnchorClick} className="hover:text-white">
              {dict.nav.how}
            </a>
            <a href="#why" onClick={handleAnchorClick} className="hover:text-white">
              {dict.nav.why}
            </a>
            <a href="#cta" onClick={handleAnchorClick} className="hover:text-white">
              {dict.nav.access}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <a
              href="#cta"
              onClick={handleAnchorClick}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
            >
              {dict.ctaBtn}
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="stars" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {dict.hero.h1a}
              <span className="text-brand-400">{dict.hero.h1b}</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/70">{dict.hero.p}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#cta"
                onClick={handleAnchorClick}
                className="inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-400 px-6 py-3 font-semibold text-white transition glow"
              >
                {dict.hero.primary}
              </a>
              <a
                href="#how"
                onClick={handleAnchorClick}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white/90 hover:bg-white/5"
              >
                {dict.hero.secondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold">{dict.how.h2}</h2>
          <p className="mt-2 text-white/70 max-w-2xl">{dict.how.p}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{dict.how.card1t}</h3>
              <p className="text-white/70">{dict.how.card1p}</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-1">{dict.how.card2t}</h3>
              <p className="text-white/70">{dict.how.card2p}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold">{dict.why.h2}</h2>
          <p className="mt-2 text-white/70">{dict.why.p}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{dict.why.c1t}</h3>
              <p className="text-white/70">{dict.why.c1p}</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{dict.why.c2t}</h3>
              <p className="text-white/70">{dict.why.c2p}</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                <span className="text-2xl">⚡️</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{dict.why.c3t}</h3>
              <p className="text-white/70">{dict.why.c3p}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div
            className={`rounded-3xl border border-white/10 bg-white/[.03] p-8 md:p-12 text-center ${shake ? "shake" : ""}`}
            ref={formRef}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold">
              {dict.cta.h2a}
              <span className="text-brand-400">{dict.cta.h2b}</span>
              {dict.cta.h2c}
            </h2>
            <p className="mt-2 text-white/70">{dict.cta.p}</p>

            <form
              className="mx-auto mt-8 flex w-full max-w-xl flex-col sm:flex-row items-center gap-3"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                validateAndSubmit();
              }}
            >
              <input
                ref={emailInputRef}
                type="email"
                required
                name="email"
                placeholder={dict.cta.emailPh}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                className={`flex-1 rounded-full bg-white/5 px-5 py-3 outline-none ring-1 ring-inset ${
                  error ? "ring-red-500" : "ring-white/10"
                } focus:ring-brand-400 transition`}
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-brand-500 px-6 py-3 font-semibold hover:bg-brand-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {btnText}
              </button>
            </form>

            {error && (
              <p id="email-error" className="mt-3 text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-white/50">{dict.cta.note}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <a className="text-lg font-extrabold" href="#top" onClick={handleAnchorClick}>
            Hire<span className="text-brand-400">Match</span>
          </a>
          <nav className="flex gap-6 text-sm text-white/70">
            <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>
              {dict.footer.privacy}
            </a>
            <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>
              {dict.footer.contacts}
            </a>
          </nav>
          <p className="text-xs text-white/50">{dict.footer.copyright}</p>
        </div>
      </footer>

      <div aria-live="polite" className="sr-only">
        {announce}
      </div>
    </main>
  );
}