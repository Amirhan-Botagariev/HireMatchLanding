"use client";

import { useState, useCallback, useMemo } from "react";
import StepWaypoint from "./StepWaypoint";
import StickyStepText from "./StickyStepText";
import ProcessScene from "./ProcessScene";

type Step = { title: string; text?: string };

export default function ProcessSynced({
  steps,
  tailHeight = "110vh",
}: {
  steps: Step[];
  tailHeight?: string;
}) {
  const normalized = useMemo(() => (Array.isArray(steps) ? steps : []), [steps]);
  const [step, setStep] = useState(0);

  const onActive = useCallback(
    (i: number) => {
      const next = Number.isFinite(i)
        ? Math.max(0, Math.min(i, normalized.length - 1))
        : 0;
      setStep(next);
    },
    [normalized.length]
  );

  if (!normalized.length) return null;

  const lastIndex = normalized.length - 1;

  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="sticky top-0 min-h-screen z-50 flex flex-col items-center justify-center">
          {/* картинка занимает до 45% экрана */}
          <div className="flex items-center justify-center h-[40vh] max-h-[280px] w-full">
            <ProcessScene step={step} />
          </div>

          {/* текст — под картинкой, адаптивный */}
          <div className="mt-6 px-2 text-center">
            <StickyStepText step={step} steps={normalized} />
          </div>
        </div>

        <div>
          {normalized.map((_, i) => (
            <StepWaypoint key={i} index={i} onActive={onActive} height="70vh" />
          ))}
          <StepWaypoint
            key="tail-mobile"
            index={lastIndex}
            onActive={onActive}
            height={tailHeight}
          />
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="relative">
          <div className="sticky top-0 h-screen flex items-center justify-between gap-10">
            <div className="w-1/2 flex items-center justify-center">
              <ProcessScene step={step} />
            </div>
            <div className="w-1/2 flex items-center">
              <StickyStepText step={step} steps={normalized} />
            </div>
          </div>

          <div>
            {normalized.map((_, i) => (
              <StepWaypoint key={i} index={i} onActive={onActive} height="65vh" />
            ))}
            <StepWaypoint
              key="tail-desktop"
              index={lastIndex}
              onActive={onActive}
              height={tailHeight}
            />
          </div>
        </div>
      </div>
    </section>
  );
}