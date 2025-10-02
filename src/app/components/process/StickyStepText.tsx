// StickyStepText.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function StickyStepText({ step, steps }:{
  step:number; steps:{title:string; text?:string}[];
}) {
  const s = steps[step] ?? steps[0];

  return (
    <div className="sticky top-24 h-auto md:h-[65vh] flex md:items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">{s.title}</h2>
          {s.text ? (<p className="mt-3 text-white/70 text-xl">{s.text}</p>) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}