"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import AnimatedText from "@/app/components/AnimatedText";
import PageTransitions from "@/app/components/PageTransitions";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

type Locale = "ru" | "en" | "kz";

type Dict = {
  nav: { how: string; why: string; access: string };
  ctaBtn: string;
  hero: { h1a: string; h1b: string; p: string; primary: string; secondary: string };
  how: { h2: string; p: string; card1t: string; card1p: string; card2t: string; card2p: string };
  why: { h2: string; p: string; c1t: string; c1p: string; c2t: string; c2p: string; c3t: string; c3p: string };
  cta: {
    h2a: string; h2b: string; h2c: string; p: string;
    submit: string; sending: string; done: string; emailPh: string; error: string; note: string;
  };
  footer: { privacy: string; contacts: string; copyright: string };
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: easeOutExpo, duration: 0.35 },
  },
};

const cardsReveal = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.05 },
} as const);

export default function HomeClient({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [btnText, setBtnText] = useState(dict.cta.submit);
  const [shake, setShake] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const clearError = useCallback(() => setError(null), []);

  const showError = useCallback(
    (msg = dict.cta.error) => {
      setError(msg);
      setShake(true);
      // короткая «тряска», потом убираем класс
      const t = setTimeout(() => setShake(false), 400);
      setAnnounce(msg);
      return () => clearTimeout(t);
    },
    [dict.cta.error]
  );

  const closeNav = useCallback(() => setNavOpen(false), []);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = (e.currentTarget.getAttribute("href") || "").trim();
      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
          closeNav();
        }
      }
    },
    [closeNav]
  );

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
      const t = setTimeout(() => {
        setSubmitting(false);
        setBtnText(dict.cta.submit);
      }, 2000);
      return () => clearTimeout(t);
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
    if (error && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    if (!navOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNav();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [navOpen, closeNav]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeNav();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeNav]);

  return (
    <PageTransitions locale={locale}>
      <main suppressHydrationWarning>
        {/* Header */}
        <motion.header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <a
              href="#top"
              onClick={handleAnchorClick}
              className="text-lg font-extrabold tracking-tight sm:text-xl"
            >
              Hire<span className="text-brand-400">Match</span>
            </a>

            <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <a href="#how" onClick={handleAnchorClick} className="transition hover:text-white">
                {dict.nav.how}
              </a>
              <a href="#why" onClick={handleAnchorClick} className="transition hover:text-white">
                {dict.nav.why}
              </a>
              <a href="#cta" onClick={handleAnchorClick} className="transition hover:text-white">
                {dict.nav.access}
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher locale={locale} />
              <a
                href="#cta"
                onClick={handleAnchorClick}
                className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/15 sm:inline-flex"
              >
                {dict.ctaBtn}
              </a>
              <button
                type="button"
                onClick={() => setNavOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/10 md:hidden"
                aria-expanded={navOpen}
                aria-label="Toggle navigation"
              >
                <span className="sr-only">Toggle navigation</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5"
                >
                  {navOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5M3.75 12h16.5M3.75 16.5h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </motion.header>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-base-950/95 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.nav
                className="mx-auto mt-20 flex w-full max-w-sm flex-col gap-4 px-6"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <a
                  href="#how"
                  onClick={handleAnchorClick}
                  className="rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 text-lg font-semibold text-white/90 transition hover:bg-white/[.08]"
                >
                  {dict.nav.how}
                </a>
                <a
                  href="#why"
                  onClick={handleAnchorClick}
                  className="rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 text-lg font-semibold text-white/90 transition hover:bg-white/[.08]"
                >
                  {dict.nav.why}
                </a>
                <a
                  href="#cta"
                  onClick={handleAnchorClick}
                  className="rounded-2xl border border-white/10 bg-brand-500/10 px-5 py-4 text-lg font-semibold text-brand-100 transition hover:bg-brand-500/20"
                >
                  {dict.nav.access}
                </a>
                <a
                  href="#cta"
                  onClick={handleAnchorClick}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400"
                >
                  {dict.ctaBtn}
                </a>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div className="stars" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center md:mx-0 md:text-left"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            >
              <motion.h1
                className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                variants={sectionVariants}
              >
                <AnimatedText text={dict.hero.h1a} by="words" />
                <AnimatedText text={dict.hero.h1b} by="words" className="text-brand-400" delay={0.15} />
              </motion.h1>

              <motion.p
                className="mt-4 text-base text-white/70 sm:text-lg md:mt-5 md:text-xl"
                variants={sectionVariants}
              >
                <AnimatedText text={dict.hero.p} by="words" delay={0.2} />
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start"
                variants={sectionVariants}
              >
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
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How */}
        <motion.section
          id="how"
          className="relative"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">{dict.how.h2}</h2>
            <p className="mt-2 max-w-2xl text-base text-white/70 sm:text-lg">{dict.how.p}</p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10"
                  initial={cardsReveal(i).initial}
                  whileInView={cardsReveal(i).whileInView}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={cardsReveal(i).transition}
                >
                  <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                    <span className="text-2xl">{i === 1 ? "📄" : "🤖"}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{dict.how[i === 1 ? "card1t" : "card2t"]}</h3>
                  <p className="text-white/70">{dict.how[i === 1 ? "card1p" : "card2p"]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why */}
        <motion.section
          id="why"
          className="relative"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">{dict.why.h2}</h2>
            <p className="mt-2 text-base text-white/70 sm:text-lg">{dict.why.p}</p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {["c1", "c2", "c3"].map((k, i) => (
                <motion.div
                  key={k}
                  className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10"
                  initial={cardsReveal(i).initial}
                  whileInView={cardsReveal(i).whileInView}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={cardsReveal(i).transition}
                >
                  <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4">
                    <span className="text-2xl">{i === 0 ? "⏰" : i === 1 ? "📈" : "⚡️"}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{dict.why[`${k}t` as "c1t" | "c2t" | "c3t"]}</h3>
                  <p className="text-white/70">{dict.why[`${k}p` as "c1p" | "c2p" | "c3p"]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <section id="cta" className="relative">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
            <motion.div
              className={`rounded-3xl border border-white/10 bg-white/[.03] p-8 md:p-12 text-center ${shake ? "shake" : ""}`}
              ref={formRef}
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold">
                <AnimatedText text={dict.cta.h2a} by="words" />
                <AnimatedText text={dict.cta.h2b} by="chars" className="text-brand-400" delay={0.1} />
                <AnimatedText text={dict.cta.h2c} by="chars" delay={0.15} />
              </h2>

              <p className="mt-2 text-white/70">
                <AnimatedText text={dict.cta.p} by="words" delay={0.2} />
              </p>

              <form
                className="mx-auto mt-8 flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row"
                noValidate
                onSubmit={onSubmit}
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
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-brand-500 px-6 py-3 font-semibold transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[10rem]"
                  whileTap={{ scale: 0.98 }}
                >
                  {btnText}
                </motion.button>
              </form>

              {error && (
                <p id="email-error" className="mt-3 text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <p className="mt-3 text-xs text-white/50">{dict.cta.note}</p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          className="border-t border-white/5"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
            <a className="text-lg font-extrabold" href="#top" onClick={handleAnchorClick}>
              Hire<span className="text-brand-400">Match</span>
            </a>
            <nav className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:gap-6">
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>
                {dict.footer.privacy}
              </a>
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>
                {dict.footer.contacts}
              </a>
            </nav>
            <p className="text-xs text-white/50">{dict.footer.copyright}</p>
          </div>
        </motion.footer>

        {/* aria-live для анонсов */}
        <div aria-live="polite" className="sr-only">
          {announce}
        </div>
      </main>
    </PageTransitions>
  );
}