"use client";

import { useState } from "react";
import { Button } from "@/app/_components/Button/Button";
import { InkCurve } from "@/app/_components/InkCurve/InkCurve";
import { Slip } from "@/app/_components/Slip/Slip";
import { playTone } from "@/app/_lib/audio";
import { cx } from "@/app/_lib/cx";
import { TONES } from "@/app/_lib/tones";
import styles from "./RegionSwitch.module.css";

type Region = "hanoi" | "saigon";

/** Each slot is one tone as the ear hears it; the numbers are indexes into TONES. */
const SLOTS: Record<Region, number[][]> = {
  hanoi: [[0], [1], [2], [3], [4], [5]],
  // In the south hỏi (3) and ngã (4) fall together into one dip-and-rise.
  saigon: [[0], [1], [2], [3, 4], [5]],
};

const REGIONS: { id: Region; name: string; text: string }[] = [
  {
    id: "hanoi",
    name: "Hà Nội",
    text: "All six tones are distinct. This is the system most textbooks teach, and the one this page uses.",
  },
  {
    id: "saigon",
    name: "Sài Gòn",
    text: "Hỏi and ngã sound the same: one dip-and-rise serves for both. The ear hears five tones, so people spell the two from memory.",
  },
];

export function RegionSwitch() {
  const [region, setRegion] = useState<Region>("hanoi");
  const slots = SLOTS[region];
  const current = REGIONS.find((r) => r.id === region)!;

  return (
    <Slip tilt="left" className={styles.panel}>
      <div className={styles.top}>
        <div className={styles.switch} role="group" aria-label="Accent">
          {REGIONS.map((r) => (
            <Button key={r.id} aria-pressed={region === r.id} onClick={() => setRegion(r.id)}>
              <span lang="vi">{r.name}</span>
            </Button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          <span>{slots.length}</span> tones
        </p>
      </div>

      {/* key restarts the sweep each time the accent changes */}
      <ul className={styles.slots} key={region}>
        {slots.map((slot, i) => {
          const first = TONES[slot[0]];
          const merged = slot.length > 1;
          return (
            <li key={first.id}>
              <button
                type="button"
                className={cx(styles.slot, merged && styles.merged)}
                onClick={() => playTone(slot[0])}
                aria-label={`Hear the pitch of ${slot.map((t) => TONES[t].word).join(" and ")}`}
              >
                <InkCurve
                  curve={first.curve}
                  tone={merged ? "pen" : "ink"}
                  staff
                  reveal
                  delay={i * 0.12}
                  className={styles.curve}
                />
                <span className={styles.words} lang="vi">
                  {slot.map((t) => TONES[t].word).join(" = ")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.text}>{current.text}</p>
      <p className={styles.fine}>Shapes are simplified. Tap a tone to hear its pitch.</p>
    </Slip>
  );
}
