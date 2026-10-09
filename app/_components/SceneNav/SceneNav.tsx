"use client";

import { useEffect, useState } from "react";
import type { Scene } from "@/app/_lib/scenes";
import styles from "./SceneNav.module.css";

/** Index tabs on the right edge of the page; lights the section on screen. */
export function SceneNav({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(scenes[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of scenes) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [scenes]);

  return (
    <nav className={styles.nav} aria-label="Sections">
      <ul>
        {scenes.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={styles.tab}
              title={s.label}
              aria-current={active === s.id ? "true" : undefined}
            >
              {s.num}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
