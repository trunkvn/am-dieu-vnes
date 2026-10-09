"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Button, PlayIcon } from "@/app/_components/Button/Button";
import { InkCurve } from "@/app/_components/InkCurve/InkCurve";
import { Note } from "@/app/_components/Note/Note";
import { Slip } from "@/app/_components/Slip/Slip";
import { playTone, playWord, preloadWords } from "@/app/_lib/audio";
import { TONES } from "@/app/_lib/tones";
import styles from "./TonePicker.module.css";

/** The six words appear one by one; tap one to hear it and read what it means. */
export function TonePicker() {
  const [current, setCurrent] = useState(0);
  const tone = TONES[current];

  useEffect(preloadWords, []);

  function pick(index: number) {
    setCurrent(index);
    playWord(index);
  }

  return (
    <>
      <ul className={styles.six} aria-label="The six words">
        {TONES.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              className={styles.word}
              style={{ "--d": i } as CSSProperties}
              aria-pressed={i === current}
              onClick={() => pick(i)}
            >
              <InkCurve curve={t.curve} viewBox="0 0 120 80" className={styles.curve} />
              <span className={styles.text} lang="vi">
                {t.word}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Slip tilt="right" className={styles.detail} aria-live="polite">
        <div className={styles.big} lang="vi">
          {tone.word}
        </div>
        <div>
          <h3 className={styles.toneName}>
            <span lang="vi">{tone.vi}</span> · {tone.en}
          </h3>
          <p className={styles.mean}>{tone.mean}</p>
          <p className={styles.example}>
            <span lang="vi">{tone.example[0]}</span> — {tone.example[1]}
          </p>
        </div>
        <div className={styles.actions}>
          <Button onClick={() => playTone(current)}>Pitch only</Button>
          <Button solid onClick={() => playWord(current)}>
            <PlayIcon />
            Hear it
          </Button>
        </div>
      </Slip>

      <p className={styles.hint}>
        <Note>↑ tap a word to hear it and see what it means</Note>
      </p>
    </>
  );
}
