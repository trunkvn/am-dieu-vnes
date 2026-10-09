import { Heading } from "@/app/_components/Heading/Heading";
import { Note } from "@/app/_components/Note/Note";
import { Section } from "@/app/_components/Section/Section";
import { Slip } from "@/app/_components/Slip/Slip";
import { RegionSwitch } from "./RegionSwitch";
import styles from "./NorthSouth.module.css";

const MOTHER = [
  { word: "mẹ", place: "Hà Nội" },
  { word: "mạ", place: "Huế" },
  { word: "má", place: "Sài Gòn" },
] as const;

export function NorthSouth() {
  return (
    <Section id="s07" num="07" eyebrowVi="Từ Bắc vào Nam" eyebrowEn="North to south">
      <Heading>
        The melody changes <em>as you travel.</em>
      </Heading>
      <p className={styles.lede}>
        Vietnam doesn’t have one set of tones. Go down the country and the shapes shift, and some
        of them merge.
      </p>

      <RegionSwitch />

      <p className={styles.central}>
        <Note>
          the centre is different again: accents around Huế often count five tones too, but which
          ones merge depends on where you stand. Sources don’t fully agree, so read this as a
          rough map.
        </Note>
      </p>

      <Slip tilt="right" className={styles.mothers}>
        <h3 className={styles.mothersTitle}>One word, three maps: “mother”</h3>
        <ul className={styles.mothersList}>
          {MOTHER.map((m) => (
            <li key={m.place}>
              <span className={styles.mother} lang="vi">
                {m.word}
              </span>
              <span className={styles.place}>{m.place}</span>
            </li>
          ))}
        </ul>
        <p className={styles.joke}>
          And in the north <span lang="vi">má</span> is a cheek. Say it to the wrong person and
          you’ll get a smile.
        </p>
      </Slip>
    </Section>
  );
}
