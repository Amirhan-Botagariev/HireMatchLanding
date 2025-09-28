"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

type Props = {
  text?: unknown;
  // оставлен для совместимости, но не используется
  by?: "words" | "chars";
  delay?: number;
  className?: string;
};

export default function AnimatedText({
  text,
  delay = 0,
  className,
}: Props) {
  if (typeof text !== "string") {
    if (text == null) return <span className={clsx(className)} />;
    return <span className={clsx(className)}>{text as any}</span>;
  }

  const safeText = text ?? "";
  const wordsAndSpaces = safeText.split(/(\s+)/); // слова и блоки пробелов

  return (
    <span className={clsx("whitespace-pre-wrap", className)} aria-label={safeText}>
      {wordsAndSpaces.map((t, i) =>
        /^\s+$/.test(t) ? (
          <span key={`sp-${i}`}>{t}</span>
        ) : (
          <motion.span
            key={`w-${i}`}
            className="inline-block will-change-transform"
            initial={{ opacity: 0, y: 6, filter: "blur(1.5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
              mass: 0.7,
              duration: 0.55,
              delay: delay + i * 0.055,
            }}
          >
            {t}
          </motion.span>
        )
      )}
    </span>
  );
}