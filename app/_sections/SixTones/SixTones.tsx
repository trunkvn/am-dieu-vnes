import { Heading } from "@/app/_components/Heading/Heading";
import { Section } from "@/app/_components/Section/Section";
import { ToneGrid } from "./ToneGrid";
import styles from "./SixTones.module.css";

export function SixTones() {
  return (
    <Section id="s03" num="03" eyebrowVi="Sáu thanh" eyebrowEn="The six tones">
      <Heading>
        Six tones, <em>six shapes.</em>
      </Heading>
      <p className={styles.lede}>
        This is the Hanoi system, the one most learners are taught. The small numbers are a
        linguist’s shorthand: <b>1</b> is the bottom of your range, <b>5</b> the top. The shapes
        are approximate.
      </p>
      <ToneGrid />
    </Section>
  );
}
