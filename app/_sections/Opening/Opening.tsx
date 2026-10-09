import { Section } from "@/app/_components/Section/Section";
import { TonePicker } from "./TonePicker";
import styles from "./Opening.module.css";

export function Opening() {
  return (
    <Section id="s01" num="01" eyebrowVi="Mở đầu" eyebrowEn="Opening" first>
      <p className={styles.quote}>
        “Same letters. Six voices. <em>Six different words.</em>”
      </p>
      <TonePicker />
    </Section>
  );
}
