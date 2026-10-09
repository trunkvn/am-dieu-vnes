import { Heading } from "@/app/_components/Heading/Heading";
import { Section } from "@/app/_components/Section/Section";
import { VoicePad } from "./VoicePad";
import styles from "./DrawVoice.module.css";

export function DrawVoice() {
  return (
    <Section id="s04" num="04" eyebrowVi="Vẽ giọng của bạn" eyebrowEn="Draw your voice" graph>
      <Heading>
        Draw a line, <em>hear a word.</em>
      </Heading>
      <p className={styles.lede}>
        Drag a finger, or the mouse, across the page. We find the nearest tone and play a pitch
        that follows your line.
      </p>
      <VoicePad />
    </Section>
  );
}
