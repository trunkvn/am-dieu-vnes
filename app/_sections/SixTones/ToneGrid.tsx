"use client";

import { useEffect, useRef, useState } from "react";
import { Button, PlayIcon } from "@/app/_components/Button/Button";
import { InkCurve } from "@/app/_components/InkCurve/InkCurve";
import { Slip } from "@/app/_components/Slip/Slip";
import { playTone, playWord, preloadWords } from "@/app/_lib/audio";
import { cx } from "@/app/_lib/cx";
import { TONES } from "@/app/_lib/tones";
import styles from "./ToneGrid.module.css";

const LIT_MS = 900;

/** One slip per tone: mark, shape, how to say it, and an example to hear. */
export function ToneGrid() {
  const [lit, setLit] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    preloadWords();
    return () => clearTimeout(timer.current);
  }, []);

  function hear(index: number, play: (i: number) => void) {
    play(index);
    setLit(index);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLit(null), LIT_MS);
  }

  return (
    <div className={styles.grid}>
      {TONES.map((t, i) => (
        <Slip
          key={t.id}
          tilt={i % 2 ? "right" : "left"}
          className={cx(styles.card, lit === i && styles.lit)}
        >
          <div className={styles.top}>
            <span className={styles.mark} lang="vi">
              {t.mark}
            </span>
            <span className={styles.num} title="Pitch numbers, 1 = low, 5 = high">
              {t.num}
            </span>
          </div>
          <h3 className={styles.name}>
            <span lang="vi">{t.vi}</span>
            <span>{t.en}</span>
          </h3>
          <InkCurve curve={t.curve} staff reveal delay={i * 0.15} className={styles.curve} />
          <p className={styles.how}>{t.how}</p>
          <div className={styles.example}>
            <p>
              <span className={styles.word} lang="vi">
                {t.word}
              </span>
              <span className={styles.mean}>{t.mean}</span>
            </p>
            <div className={styles.actions}>
              <Button small onClick={() => hear(i, playTone)} aria-label={`Hear the pitch of ${t.word}`}>
                Pitch
              </Button>
              <Button small solid round onClick={() => hear(i, playWord)} aria-label={`Hear ${t.word}`}>
                <PlayIcon />
              </Button>
            </div>
          </div>
        </Slip>
      ))}
    </div>
  );
}
