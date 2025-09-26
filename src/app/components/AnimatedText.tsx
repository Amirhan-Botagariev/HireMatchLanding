"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function AnimatedText({
  text,
  by = "words",
  delay = 0,
  className,
}: {
  text: string;
  by?: "words" | "chars";
  delay?: number;
  className?: string;
}) {
  const tokens =
    by === "words"
      ? text.split(/(\s+)/)
      : Array.from(text);

  return (
    <span className={clsx("whitespace-pre-wrap", className)} aria-label={text}>
      {tokens.map((t, i) => {
        const isSpace = /^\s+$/.test(t);
        if (isSpace) {
          return <span key={`s-${i}`}>{t}</span>;
        }
        return (
          <motion.span
            key={i}
            className="inline-block will-change-transform"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          >
            {t}
          </motion.span>
        );
      })}
    </span>
  );
}