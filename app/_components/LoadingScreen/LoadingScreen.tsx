"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./LoadingScreen.module.css";

/** The book stays shut at least this long on a first visit, so the label can finish writing itself. */
const FIRST_MS = 1800;
/** On a later load in the same session it only covers the wait, and fades away quickly. */
const REPEAT_MS = 600;
const SEEN_KEY = "vo-tap-noi:splash-seen";

/**
 * A closed exercise book on the desk while fonts and assets load. When
 * everything is ready the cover swings open, the camera moves in on the right
 * hand page, and the real page takes over. It is in the server-rendered HTML,
 * so it shows from the first paint, and a CSS animation clears it anyway if
 * scripts never run.
 */
export function LoadingScreen() {
  const root = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // storage can be blocked; show the full splash
    }
    // ?splash replays the whole show, handy for checking it after a reload
    const forced = new URLSearchParams(location.search).has("splash");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const quick = calm || (seen && !forced);
    const minimum = quick ? REPEAT_MS : FIRST_MS;

    let cancelled = false;
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    void Promise.all([loaded, document.fonts?.ready]).then(() => {
      // performance.now() counts from the start of navigation, so this is the total time shown
      const wait = Math.max(0, minimum - performance.now());
      setTimeout(() => {
        const el = root.current;
        const right = page.current;
        if (cancelled || !el) return;
        // Remember the visit only once it has actually played. Doing it earlier would
        // make React's dev-mode double effect run mistake the first load for a repeat.
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          // ignore
        }
        if (!quick && right) {
          // zoom far enough that the right-hand page fills the screen
          const { width, height } = right.getBoundingClientRect();
          el.style.setProperty("--zoom", String(Math.max(innerWidth / width, innerHeight / height) * 1.04));
        }
        el.dataset.mode = quick ? "quick" : "full";
        el.dataset.state = "done";
      }, wait);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className={styles.splash}
      role="status"
      aria-label="Loading"
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "opacity") setGone(true);
      }}
    >
      <div className={styles.stage}>
        <div className={styles.book}>
          {/* the right-hand page, under the cover */}
          <div ref={page} className={styles.right} />

          <div className={styles.cover}>
            <div className={styles.front}>
              <div className={styles.binding} aria-hidden="true" />
              <div className={styles.frame} aria-hidden="true" />
              <div className={styles.label}>
                <b>Vở tập nói · Speaking notebook</b>
                <p className={styles.line} style={{ "--d": "0.3s" } as CSSProperties}>
                  <span lang="vi">Môn</span>: <span lang="vi">Thanh điệu</span>
                </p>
                <p className={styles.line} style={{ "--d": "0.9s" } as CSSProperties}>
                  <span lang="vi">Bài 1</span>: <u lang="vi">ma mà má mả mã mạ</u>
                </p>
              </div>
            </div>
            {/* the inside of the cover is the left-hand page once it has swung open */}
            <div className={styles.inside} />
          </div>
        </div>

        <p className={styles.status} lang="vi">
          Đang mở vở<i>.</i>
          <i>.</i>
          <i>.</i>
        </p>
      </div>
    </div>
  );
}
