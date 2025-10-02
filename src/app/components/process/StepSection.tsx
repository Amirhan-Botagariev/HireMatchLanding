//StepSection.tsx
"use client";
import { useEffect, useRef } from "react";

export default function StepSection({
  index, title, text, onActive,
}: { index: number; title: string; text?: string; onActive: (i:number)=>void }) {
  const ref = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && onActive(index)),
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onActive]);

  return (
    <section ref={ref} className="scroll-mt-28">
      <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h2>
      {text ? <p className="mt-3 text-white/70 text-lg">{text}</p> : null}
    </section>
  );
}