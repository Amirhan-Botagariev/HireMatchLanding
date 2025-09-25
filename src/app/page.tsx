"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [btnText, setBtnText] = useState("Попробовать");
  const [shake, setShake] = useState(false);
  const [announce, setAnnounce] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const clearError = useCallback(() => setError(null), []);
  const showError = useCallback((msg = "Вы ввели некорректную почту") => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setAnnounce(msg);
  }, []);

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
      locale: typeof navigator !== "undefined" ? navigator.language : "",
      tzOffsetMin: new Date().getTimezoneOffset()
    };
  }, []);

  const validateAndSubmit = useCallback(async () => {
    const trimmed = email.trim();
    if (!emailRegex.test(trimmed)) {
      showError();
      return;
    }
    clearError();
    setSubmitting(true);
    setBtnText("Отправка…");

    const payload = Object.assign({ email: trimmed }, buildTracking());

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setBtnText("Готово!");
        setAnnounce("Спасибо — вы в списке рассылки");
        setEmail("");
      } else {
        setBtnText("Готово!");
        setAnnounce("Ошибка сервера, попробуйте позже");
      }
    } catch (err) {
      console.error("Network error", err);
      setBtnText("Готово!");
      setAnnounce("Ошибка сети, попробуйте позже");
    } finally {
      setTimeout(() => {
        setSubmitting(false);
        setBtnText("Попробовать");
      }, 2000);
    }
  }, [email, emailRegex, clearError, showError, buildTracking]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      validateAndSubmit();
    },
    [validateAndSubmit]
  );

  // Мини-тесты (?test=1) — только в браузере
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.search.includes("test=1")) return;
    const tests: Record<string, boolean> = {
      "user@example.com": true,
      "user.name+tag@sub.domain.co": true,
      "@example.com": false,
      "user@": false,
      "user@domain": false,
      "user domain.com": false,
      "": false
    };
    let pass = true;
    let i = 0;
    for (const k in tests) {
      i++;
      const ok = emailRegex.test(k) === tests[k];
      pass = pass && ok;
      console.log("Test", i, k, ok ? "✅" : "❌");
    }
    console.log("All tests passed?", pass);
    console.log("Tracking sample:", buildTracking());
  }, [emailRegex, buildTracking]);

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
            <a href="#how" onClick={handleAnchorClick} className="hover:text-white">Как это работает</a>
            <a href="#why" onClick={handleAnchorClick} className="hover:text-white">Почему мы</a>
            <a href="#cta" onClick={handleAnchorClick} className="hover:text-white">Доступ</a>
          </nav>
          <a href="#cta" onClick={handleAnchorClick} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15">
            Получить доступ
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="stars" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 md:pt-28 md:pb-32 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Устаёшь тратить часы на отклики, <span className="text-brand-400">которые никто не читает?</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/70">
              Твоё резюме теряется среди сотен других? Доверь рутину ИИ и получай больше интервью.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#cta" onClick={handleAnchorClick} className="inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-400 px-6 py-3 font-semibold text-white transition glow">
                Получить ранний доступ
              </a>
              <a href="#how" onClick={handleAnchorClick} className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 font-semibold text-white/90 hover:bg-white/5">
                Как это работает
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold">HireMatch решает эту проблему</h2>
          <p className="mt-2 text-white/70 max-w-2xl">Искусственный интеллект автоматизирует поиск работы для соискателей.</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4"><span className="text-2xl">📄</span></div>
              <h3 className="text-xl font-bold mb-1">Загрузи резюме</h3>
              <p className="text-white/70">Просто загрузи своё резюме — мы проанализируем навыки и опыт и подберём подходящие вакансии.</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4"><span className="text-2xl">🤖</span></div>
              <h3 className="text-xl font-bold mb-1">AI отправляет заявки</h3>
              <p className="text-white/70">Алгоритм автоматически шлёт персонализированные отклики работодателям. Ты экономишь время и силы.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold">Почему HireMatch?</h2>
          <p className="mt-2 text-white/70">Присоединись к соискателям, которые уже получают больше интервью</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4"><span className="text-2xl">⏰</span></div>
              <h3 className="text-lg font-bold mb-1">Экономь до 10 часов в неделю</h3>
              <p className="text-white/70">Забудь о бесконечном скролле и шаблонных письмах — всё сделаем мы.</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4"><span className="text-2xl">📈</span></div>
              <h3 className="text-lg font-bold mb-1">Больше шансов получить ответ</h3>
              <p className="text-white/70">Персонализация повышает конверсию откликов и ответы рекрутеров.</p>
            </div>
            <div className="card rounded-2xl p-6 transition-transform duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-brand-500/10">
              <div className="size-10 rounded-lg bg-brand-500/15 flex items-center justify-center mb-4"><span className="text-2xl">⚡️</span></div>
              <h3 className="text-lg font-bold mb-1">Быстрее найдёшь работу</h3>
              <p className="text-white/70">HireMatch работает 24/7, пока ты занимаешься своими делами.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className={`rounded-3xl border border-white/10 bg-white/[.03] p-8 md:p-12 text-center ${shake ? "shake" : ""}`} ref={formRef}>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Готов попробовать <span className="text-brand-400">HireMatch</span>?
            </h2>
            <p className="mt-2 text-white/70">Стань одним из первых, кто получит доступ к платформе, которая ускорит твой поиск работы.</p>

            <form className="mx-auto mt-8 flex w-full max-w-xl flex-col sm:flex-row items-center gap-3" noValidate onSubmit={onSubmit}>
              <input
                ref={emailInputRef}
                type="email"
                required
                name="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) clearError(); }}
                className={`flex-1 rounded-full bg-white/5 px-5 py-3 outline-none ring-1 ring-inset ${error ? "ring-red-500" : "ring-white/10"} focus:ring-brand-400 transition`}
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
            <p className="mt-3 text-xs text-white/50">Никакого спама. Только уведомления о запуске и важные обновления.</p>
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
            <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>Политика конфиденциальности</a>
            <a href="#" className="hover:text-white" onClick={(e) => e.preventDefault()}>Контакты</a>
          </nav>
          <p className="text-xs text-white/50">© 2025 HireMatch. All rights reserved.</p>
        </div>
      </footer>

      {/* aria-live уведомления */}
      <div aria-live="polite" className="sr-only">{announce}</div>
    </main>
  );
}