"use client";

import Image from "next/image";
import { useIsMobile } from "app/hooks/useIsMobile";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

const ICONS = [
  { src: "/icons/resume.png", alt: "Resume" },
  { src: "/icons/analyze.png", alt: "Brain" },
  { src: "/icons/jobs.png", alt: "Jobs" },
  { src: "/icons/mail.png", alt: "Mail" },
  { src: "/icons/trophy.png", alt: "Trophy" },
];

export default function ProcessScene({ step }: { step: number }) {
  const isMobile = useIsMobile();
  const shouldReduce = useReducedMotion();

  // направление анимации (вперёд / назад)
  const prevStep = useRef(step);
  const dir = step > prevStep.current ? 1 : -1;
  useEffect(() => {
    prevStep.current = step;
  }, [step]);

  // безопасный индекс шага + размеры
  const safeStep = Number.isFinite(step)
    ? Math.max(0, Math.min(step, ICONS.length - 1))
    : 0;
  const icon = ICONS[safeStep] ?? ICONS[0];
  const size = isMobile ? 240 : 380;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={safeStep}
          className="absolute inset-0 flex items-center justify-center"
          initial={
            shouldReduce
              ? { opacity: 0 }
              : { opacity: 0, y: dir > 0 ? 16 : -16, scale: 0.96 }
          }
          animate={
            shouldReduce
              ? { opacity: 1 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={
            shouldReduce
              ? { opacity: 0 }
              : { opacity: 0, y: dir > 0 ? -16 : 16, scale: 0.96 }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={icon.src}
            alt={icon.alt}
            width={size}
            height={size}
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            priority={safeStep === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}