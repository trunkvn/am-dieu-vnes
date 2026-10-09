"use client";

import { useEffect, type CSSProperties } from "react";
import { playWord, preloadWords } from "@/app/_lib/audio";
import { TONES } from "@/app/_lib/tones";
import styles from "./GiantWords.module.css";

/** A slight lean for each word, so the line looks hand-written. */
const LEAN = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

/** The six words, large. Tap one to hear it. */
export function GiantWords() {
  useEffect(preloadWords, []);

  return (
    <ul className={styles.giant} aria-label="ma mà má mả mã mạ">
      {TONES.map((t, i) => (
        <li key={t.id}>
          <button
            type="button"
            className={styles.word}
            style={{ "--r": LEAN[i] } as CSSProperties}
            onClick={() => playWord(i)}
            aria-label={`Hear ${t.word}`}
            lang="vi"
          >
            {t.word}
          </button>
        </li>
      ))}
    </ul>
  );
}
