import { Heading } from "@/app/_components/Heading/Heading";
import { InkCurve } from "@/app/_components/InkCurve/InkCurve";
import { Note } from "@/app/_components/Note/Note";
import { Section } from "@/app/_components/Section/Section";
import { Slip } from "@/app/_components/Slip/Slip";
import styles from "./WhatIsATone.module.css";

const THREE_THINGS = [
  ["Height", "where the voice starts and ends, within your own range"],
  ["Direction", "level, falling, rising, or dipping"],
  [
    "Texture",
    "smooth, creaky, or cut by a catch in the throat. Ngã and nặng are set apart by texture as much as by pitch, which is why they are the hardest to copy",
  ],
] as const;

export function WhatIsATone() {
  return (
    <Section id="s02" num="02" eyebrowVi="Thanh điệu" eyebrowEn="What a tone is">
      <Heading>
        Pitch that <em>belongs to the word.</em>
      </Heading>

      <div className={styles.two}>
        <div>
          <p className={styles.para}>
            In English, your voice rises at the end of a question and the word stays the same.
            In Vietnamese the melody is part of the word. Keep the letters{" "}
            <span lang="vi" className={styles.vi}>
              m-a
            </span>
            , change the pitch, and you have said something else entirely.
          </p>
          <p className={styles.para}>
            A tone is the path your voice takes inside one syllable. It is not question
            intonation and it is not stress. Think of it as a letter you can hear.
          </p>
          <dl className={styles.things}>
            {THREE_THINGS.map(([term, text]) => (
              <div key={term} className={styles.thing}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <p>
            <Note>everyone’s “high” is their own high. The shape counts, not the note</Note>
          </p>
        </div>

        <div className={styles.compare}>
          <Slip tilt="left" className={styles.case}>
            <div className={styles.words}>
              <small>English</small>“Really?”
            </div>
            <InkCurve curve="c-q" staff reveal className={styles.curve} />
            <p className={styles.cap}>
              <Note>same word, new mood</Note>
            </p>
          </Slip>
          <Slip tilt="right" className={styles.case}>
            <div className={styles.words}>
              <small>Vietnamese</small>
              <span lang="vi">ma → má</span>
            </div>
            <InkCurve curve="c-sac" tone="pen" staff reveal delay={0.5} className={styles.curve} />
            <p className={styles.cap}>
              <Note>new pitch, new word</Note>
            </p>
          </Slip>
        </div>
      </div>
    </Section>
  );
}
