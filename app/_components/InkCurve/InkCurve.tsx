"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./InkCurve.module.css";

const STAFF_Y = [8, 24, 40, 56, 72];

type Props = {
  /** id of a curve defined in CurveDefs, e.g. "c-sac" */
  curve: string;
  tone?: "ink" | "pen" | "ghost";
  /** draw the five pitch-level lines behind the curve */
  staff?: boolean;
  /** sweep the curve in, left to right, the first time it scrolls into view */
  reveal?: boolean;
  /** seconds to wait before the sweep starts */
  delay?: number;
  viewBox?: string;
  className?: string;
};

export function InkCurve({
  curve,
  tone = "ink",
  staff = false,
  reveal = false,
  delay = 0,
  viewBox = "-4 -4 128 88",
  className,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!reveal || seen || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal, seen]);

  return (
    <svg
      ref={ref}
      className={cx(
        styles.ink,
        tone !== "ink" && styles[tone],
        reveal && seen && styles.seen,
        className,
      )}
      style={reveal ? ({ "--delay": `${delay}s` } as CSSProperties) : undefined}
      viewBox={viewBox}
      aria-hidden="true"
    >
      {/* the sweep clips this group, not the <svg>, so the observer can still see the svg */}
      <g className={reveal ? styles.sweep : undefined}>
        {staff && (
          <g className={styles.staff}>
            {STAFF_Y.map((y) => (
              <path key={y} d={`M0 ${y}H120`} />
            ))}
          </g>
        )}
        <use href={`#${curve}`} />
      </g>
    </svg>
  );
}
