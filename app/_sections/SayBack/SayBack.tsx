import { Heading } from "@/app/_components/Heading/Heading";
import { Section } from "@/app/_components/Section/Section";
import { Rehearsal } from "./Rehearsal";
import styles from "./SayBack.module.css";

export function SayBack() {
  return (
    <Section id="s05" num="05" eyebrowVi="Nói lại" eyebrowEn="Say it back" graph>
      <Heading>
        Your voice, <em>on top of the model.</em>
      </Heading>
      <p className={styles.lede}>
        Tap the microphone and say the word. Your pitch line appears over the model line, so you
        can see where the two part ways. It is measured against your own range, so a deep voice
        and a high one are treated alike.
      </p>
      <Rehearsal />
    </Section>
  );
}
