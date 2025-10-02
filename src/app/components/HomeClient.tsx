"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, Variants, useReducedMotion } from "framer-motion";
import AnimatedText from "@/app/components/AnimatedText";
import PageTransitions from "@/app/components/PageTransitions";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import dynamic from "next/dynamic";
import Image from "next/image";
const ProcessSynced = dynamic(() => import("@/app/components/process/ProcessSynced"), { ssr: false });
import type { Locale } from "@/app/i18n/config";

type Dict = {
  nav: { how: string; why: string; access: string };
  ctaBtn: string;
  hero: {
    h1a: string;
    h1b: string;
    p: string;
    primary: string;
    secondary: string;
  };
  process: {
    steps: { title: string; text: string }[];
    sourcesTitle: string;
  };
  cta: {
    h2a: string; h2b: string; h2c: string; p: string;
    submit: string; sending: string; done: string;
    emailPh: string; error: string; note: string;
    namePh: string; specialtyPh: string; telegramPh: string;
    nameError: string; telegramError: string;
  };
  footer: { privacy: string; contacts: string; copyright: string };
};

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SOURCES: { src: string; alt: string; w: number; h: number }[] = [
  { src: "/logos/hh.png", alt: "HeadHunter", w: 192, h: 80 },
  { src: "/logos/linkedin.png", alt: "LinkedIn", w: 192, h: 80 },
  { src: "/logos/indeed.png", alt: "Indeed", w: 192, h: 80 },
];

function SourcesMarquee({ dict }: { dict: Dict }) {
  const shouldReduce = useReducedMotion();
  const track = useMemo(
    () => Array.from({ length: 5 }, () => SOURCES).flat(),
    []
  );

  return (
    <section aria-label="Источники вакансий" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <h2 className="mb-6 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold">
          {dict.process.sourcesTitle}
        </h2>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base-950 to-transparent" />

          <motion.div
            className="flex items-center gap-12 whitespace-nowrap will-change-transform px-4"
            role="list"
            animate={shouldReduce ? undefined : { x: ["-50%", "0%"] }}
            transition={
              shouldReduce ? undefined : { duration: 12, ease: "linear", repeat: Infinity }
            }
          >
            {track.map((s, i) => (
              <div
                key={`${s.src}-${i}`}
                role="listitem"
                className="h-16 w-40 md:h-20 md:w-48 flex-shrink-0 transition-transform hover:scale-105"
                title={s.alt}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { ease: easeOutExpo, duration: 0.35 } },
};

const cardsReveal = (i: number) =>
  ({
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
  // ---------------------------
  // STATE (упрощённая форма)
  // ---------------------------
  const [specialty, setSpecialty] = useState("");
  const [contact, setContact] = useState(""); // Telegram/Instagram
  const [contactError, setContactError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [btnText, setBtnText] = useState(dict.cta.submit);
  const [shake, setShake] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const formRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------
  // HELPERS
  // ---------------------------
  const contactPlaceholder = useMemo(() => {
    if (locale === "en") return "Telegram/Instagram (@handle or link)";
    if (locale === "kz") return "Telegram/Instagram (@handle немесе сілтеме)";
    return "Telegram/Instagram @username";
  }, [locale]);

  const contactErrorText = useMemo(() => {
    if (locale === "en") return "Enter Telegram/Instagram: @handle or full link";
    if (locale === "kz") return "Telegram/Instagram енгізіңіз: @handle немесе сілтеме";
    return "Введите Telegram/Instagram: @ник или ссылку";
  }, [locale]);

  const validateContact = useCallback((value: string) => {
    const v = value.trim();
    if (!v) return false;
    const atHandle = /^@[A-Za-z0-9._-]{4,32}$/i.test(v);
    const url = /^https?:\/\/(t\.me|telegram\.me|instagram\.com)\/[A-Za-z0-9._-]{3,32}$/i.test(v);
    return atHandle || url;
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

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const validateAndSubmit = useCallback(async () => {
    if (!validateContact(contact)) {
      setContactError(contactErrorText);
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    } else {
      setContactError(null);
    }

    setSubmitting(true);
    setBtnText(dict.cta.sending);

    const payload = Object.assign(
      {
        contact: contact.trim(),
        specialty: specialty.trim(),
      },
      buildTracking()
    );

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setBtnText(dict.cta.done);
        setAnnounce("ok");
        setSpecialty("");
        setContact("");
      } else {
        setBtnText(dict.cta.error || dict.cta.done);
        setAnnounce("error");
      }
    } catch {
      setBtnText(dict.cta.error || dict.cta.done);
      setAnnounce("network-error");
    } finally {
      const id = window.setTimeout(() => {
        setSubmitting(false);
        setBtnText(dict.cta.submit);
      }, 2000);
      // при желании можно сохранить id в ref и чистить на unmount
    }
  }, [contact, specialty, dict.cta, buildTracking, validateContact, contactErrorText]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      validateAndSubmit();
    },
    [validateAndSubmit]
  );

  // ---------------------------
  // NAV & ACTIVE SECTION
  // ---------------------------
  const closeNav = useCallback(() => setNavOpen(false), []);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = (e.currentTarget.getAttribute("href") || "").trim();
      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          setActiveSection(href.slice(1));
          (target as HTMLElement).scrollIntoView({ behavior: "smooth" });
          // синхронизируем URL с позицией
          if (typeof history !== "undefined") {
            history.pushState(null, "", href);
          }
          closeNav();
        }
      }
    },
    [closeNav]
  );

  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNav();
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
      if (window.innerWidth >= 768) closeNav();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeNav]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ids = ["how", "why", "cta"] as const;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible.length) {
          setActiveSection(visible[0].target.id);
          return;
        }
        // fallback при сверхбыстрой прокрутке
        const scrollY = window.scrollY;
        let current: string | null = null;
        for (const el of elements) {
          if (scrollY >= el.offsetTop - 160) current = el.id;
        }
        setActiveSection(current ?? "");
      },
      {
        threshold: 0.4,
        rootMargin: "-80px 0px -40% 0px", // компенсируем высоту шапки и «визуальную» зону
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const getNavLinkClass = useCallback(
    (id: "how" | "why" | "cta") => {
      const active = activeSection === id;
      const base =
        "rounded-2xl border border-white/10 bg-white/[.04] px-5 py-4 text-lg font-semibold text-white/90 transition hover:bg-white/[.08]";
      if (!active) return base;
      return "rounded-2xl border border-brand-300 bg-brand-100 px-5 py-4 text-lg font-semibold text-brand-900 transition hover:bg-brand-100/90";
    },
    [activeSection]
  );

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <PageTransitions locale={locale}>
      <main suppressHydrationWarning>
        {/* Header */}
        <motion.header className="sticky top-0 z-40 border-b border-white/5 bg-base-950/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <a href="#top" onClick={handleAnchorClick} className="brand-nowrap text-lg font-extrabold tracking-tight sm:text-xl">
              Fast<span className="text-brand-400">Match</span>
            </a>

            <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <a href="#how" onClick={handleAnchorClick} className="transition hover:text-white">{dict.nav.how}</a>
              <a href="#why" onClick={handleAnchorClick} className="transition hover:text-white">{dict.nav.why}</a>
              <a href="#cta" onClick={handleAnchorClick} className="transition hover:text-white">{dict.nav.access}</a>
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
                  aria-hidden="true"
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.nav
                className="mx-auto mt-20 flex w-full max-w-sm flex-col gap-4 px-6"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              >
                <a href="#how" onClick={handleAnchorClick} className={getNavLinkClass("how")}>{dict.nav.how}</a>
                <a href="#why" onClick={handleAnchorClick} className={getNavLinkClass("why")}>{dict.nav.why}</a>
                <a href="#cta" onClick={handleAnchorClick} className="inline-flex w-full items-center justify-center rounded-full bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-400">
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
            <motion.div className="mx-auto max-w-3xl text-center md:mx-0 md:text-left" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07 } } }}>
              <motion.h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl" variants={sectionVariants}>
                <AnimatedText text={dict.hero.h1a} by="words" />
                <AnimatedText text={dict.hero.h1b} by="words" className="text-brand-400" delay={0.15} />
              </motion.h1>

              <motion.p className="mt-4 text-base text-white/70 sm:text-lg md:mt-5 md:text-xl" variants={sectionVariants}>
                <AnimatedText text={dict.hero.p} by="words" delay={0.2} />
              </motion.p>

              <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start" variants={sectionVariants}>
                <a href="#cta" onClick={handleAnchorClick} className="inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-400 px-6 py-3 font-semibold text-white transition glow">
                  {dict.hero.primary}
                </a>
                <a href="#how" onClick={handleAnchorClick} className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white/90 hover:bg-white/5">
                  {dict.hero.secondary}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <SourcesMarquee dict={dict} />

        <section className="relative transform-none">
          <ProcessSynced steps={dict.process.steps} />
        </section>

        {/* CTA */}
        <section id="cta" className="relative">
            <div className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:px-6 md:pt-10 md:pb-12 lg:px-8">
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
                <AnimatedText text={dict.cta.h2b} by="chars" className="brand-nowrap text-brand-400" delay={0.1} />
                <AnimatedText text={dict.cta.h2c} by="chars" delay={0.15} />
              </h2>

              <p className="mt-2 text-white/70">
                <AnimatedText text={dict.cta.p} by="words" delay={0.2} />
              </p>

              <form
                className="mx-auto mt-8 flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:flex-wrap"
                noValidate
                onSubmit={onSubmit}
              >
                {/* Специальность */}
                <label htmlFor="specialty" className="sr-only">
                  {dict.cta.specialtyPh}
                </label>
                <input
                  id="specialty"
                  type="text"
                  name="specialty"
                  placeholder={dict.cta.specialtyPh}
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  disabled={submitting}
                  className="w-full rounded-full bg-white/5 px-5 py-3 outline-none ring-1 ring-inset ring-white/10 focus:ring-brand-400 transition sm:flex-[1_1_48%]"
                />

                {/* Telegram/Instagram */}
                <label htmlFor="contact" className="sr-only">
                  {contactPlaceholder}
                </label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  placeholder={contactPlaceholder}
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (contactError) setContactError(null);
                  }}
                  disabled={submitting}
                  className={`w-full rounded-full bg-white/5 px-5 py-3 outline-none ring-1 ring-inset ${
                    contactError ? "ring-red-500" : "ring-white/10"
                  } focus:ring-brand-400 transition sm:flex-[1_1_48%]`}
                  inputMode="text"
                  autoComplete="off"
                  aria-invalid={!!contactError}
                  aria-describedby={contactError ? "form-error" : undefined}
                />

                {/* Ошибки */}
                <div className="w-full min-h-[1.25rem] mt-1 text-center" aria-live="polite">
                  {contactError && (
                    <p id="form-error" className="text-sm text-red-400" role="alert">
                      {contactError}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 mx-auto w-full sm:w-auto rounded-full bg-brand-500 px-6 py-3 font-semibold transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                  whileTap={{ scale: 0.98 }}
                >
                  {btnText}
                </motion.button>
              </form>

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
            <a className="brand-nowrap text-lg font-extrabold" href="#top" onClick={handleAnchorClick}>
              Fast<span className="text-brand-400">Match</span>
            </a>
            <nav className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:gap-6">
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>{dict.footer.privacy}</a>
              <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>{dict.footer.contacts}</a>
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