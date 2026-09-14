"use client";

import { useEffect, useState } from "react";

export default function ProgressIndicator({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div>
      <div
        className="dash-progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="dash-progress-fill"
          style={{ transform: `scaleX(${filled ? clamped / 100 : 0})` }}
        />
      </div>
      <p className="mt-2 text-[11px] font-medium tracking-[0.15em] text-soft-white/50 uppercase">
        {clamped}%
      </p>
    </div>
  );
}
