"use client";

import { useEffect } from "react";
import { Note } from "@/app/_components/Note/Note";
import { Slip } from "@/app/_components/Slip/Slip";
import { playWord, preloadWords } from "@/app/_lib/audio";
import { TONES } from "@/app/_lib/tones";
import styles from "./Marks.module.css";

/** The six marks on the letter a; tap one to hear the word it makes. */
export function Marks() {
  useEffect(preloadWords, []);

  return (
    <Slip tilt="left" className={styles.marks}>
      <p className={styles.title}>The six marks</p>
      <ul className={styles.row}>
        {TONES.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              className={styles.mark}
              onClick={() => playWord(i)}
              aria-label={`Hear ${t.word}`}
            >
              <span className={styles.letter} lang="vi">
                {t.mark}
              </span>
              <small lang="vi">{t.vi}</small>
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.note}>
        <Note>adapted from European accents, put to a new job</Note>
      </p>
    </Slip>
  );
}
