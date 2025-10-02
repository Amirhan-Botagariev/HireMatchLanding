// src/app/components/process/StepWaypoint.tsx
"use client";
import { useEffect, useRef } from "react";

export default function StepWaypoint({
  index,
  onActive,
  height = "85vh",
}: {
  index: number;
  onActive: (i: number) => void;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && onActive(index)),
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onActive]);

  // Блок занимает место при скролле, но не показывает контент
  return (
    <section
      ref={ref}
      aria-hidden
      className="pointer-events-none select-none opacity-0"
      style={{ height }}
    />
  );
}