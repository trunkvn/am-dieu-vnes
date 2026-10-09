"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CurveDefs } from "@/app/_components/InkCurve/CurveDefs";
import styles from "./Sheet.module.css";

const RULE = 32;

/** The desk, the ruled notebook page and the shared SVG defs. */
export function Sheet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  // Pad each <Section> so it ends on a ruled line.
  useEffect(() => {
    const sheet = ref.current;
    if (!sheet) return;

    const snap = () => {
      sheet.querySelectorAll<HTMLElement>("[data-snap]").forEach((el) => {
        el.style.paddingBottom = "";
        const rest = el.offsetHeight % RULE;
        if (rest) el.style.paddingBottom = `calc(var(--pb) + ${RULE - rest}px)`;
      });
    };

    snap();
    void document.fonts?.ready.then(snap);
    window.addEventListener("resize", snap);
    return () => window.removeEventListener("resize", snap);
  }, []);

  return (
    <>
      <CurveDefs />
      <div className={styles.desk}>
        <main ref={ref} className={styles.sheet}>
          {children}
        </main>
      </div>
    </>
  );
}
