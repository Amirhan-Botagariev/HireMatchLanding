"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

type Props = {
  text?: unknown;           // ← может прийти что угодно
  by?: "words" | "chars";
  delay?: number;
  className?: string;
};

export default function AnimatedText({
  text,
  by = "words",
  delay = 0,
  className,
}: Props) {
  // 1) Нормализуем вход
  if (typeof text !== "string") {
    // если null/undefined — рисуем пустую строку, если ReactNode — выводим как есть
    if (text == null) return <span className={clsx(className)} />;
    return <span className={clsx(className)}>{text as any}</span>;
  }

  const safeText = text ?? ""; // на всякий случай

  if (by === "words") {
    const wordsAndSpaces = safeText.split(/(\s+)/);
    return (
      <span className={clsx("whitespace-pre-wrap", className)} aria-label={safeText}>
        {wordsAndSpaces.map((t, i) =>
          /^\s+$/.test(t) ? (
            <span key={`s-${i}`}>{t}</span>
          ) : (
            <motion.span
              key={i}
              className="inline-block will-change-transform"
              initial={{ opacity: 0, y: 6, filter: "blur(1.5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.7, duration: 0.55, delay: delay + i * 0.055 }}
            >
              {t}
            </motion.span>
          )
        )}
      </span>
    );
  }

  // by === "chars": группируем символы в контейнер слова, чтобы слово не ломалось
  const wordsAndSpaces = safeText.split(/(\s+)/);

  return (
    <span className={clsx("whitespace-pre-wrap", className)} aria-label={safeText}>
      {wordsAndSpaces.map((chunk, wi) => {
        if (/^\s+$/.test(chunk)) return <span key={`sp-${wi}`}>{chunk}</span>;
        return (
          <span key={`w-${wi}`} className="inline-flex flex-nowrap whitespace-nowrap">
            {Array.from(chunk).map((ch, ci) => (
              <motion.span
                key={`c-${wi}-${ci}`}
                className="inline-block will-change-transform transform-gpu"
                initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 30,
                  mass: 0.7,
                  duration: 0.6,
                  delay: delay + (wi * 999 + ci) * 0.028,
                }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        );
      })}
    </span>
  );
}