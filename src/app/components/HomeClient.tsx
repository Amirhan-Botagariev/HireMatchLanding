"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
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

  return (
    <PageTransitions locale={locale}>
      <main suppressHydrationWarning>
        {/* Header */}
        <motion.header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#top" onClick={handleAnchorClick} className="text-xl font-extrabold tracking-tight">
            Hire<span className="text-brand-400">Match</span>
          </a>

          {/* меню — видно с md и шире */}
          <nav className="hidden md:flex gap-6 text-sm text-white/70">
            <a href="#how" onClick={handleAnchorClick} className="hover:text-white">{dict.nav.how}</a>
            <a href="#why" onClick={handleAnchorClick} className="hover:text-white">{dict.nav.why}</a>
            <a href="#cta" onClick={handleAnchorClick} className="hover:text-white">{dict.nav.access}</a>
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
      </motion.header>

        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div className="stars" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative">
            <motion.div
              className="max-w-3xl"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            >
              <motion.h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight" variants={sectionVariants}>
                <AnimatedText text={dict.hero.h1a} by="words" />
                <AnimatedText text={dict.hero.h1b} by="words" className="text-brand-400" delay={0.15} />
              </motion.h1>

              <motion.p className="mt-5 text-lg md:text-xl text-white/70" variants={sectionVariants}>
                <AnimatedText text={dict.hero.p} by="words" delay={0.2} />
              </motion.p>

              <motion.div className="mt-8 flex flex-col sm:flex-row gap-3" variants={sectionVariants}>
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
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-extrabold">{dict.how.h2}</h2>
            <p className="mt-2 text-white/70 max-w-2xl">{dict.how.p}</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <h2 className="text-3xl md:text-4xl font-extrabold">{dict.why.h2}</h2>
            <p className="mt-2 text-white/70">{dict.why.p}</p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
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

              <form className="mx-auto mt-8 flex w-full max-w-xl flex-col sm:flex-row items-center gap-3" noValidate onSubmit={onSubmit}>
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
                  className="rounded-full bg-brand-500 px-6 py-3 font-semibold hover:bg-brand-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
        </motion.footer>

        {/* aria-live для анонсов */}
        <div aria-live="polite" className="sr-only">
          {announce}
        </div>
      </main>
    </PageTransitions>
  );
}