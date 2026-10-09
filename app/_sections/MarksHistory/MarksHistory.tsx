import { Heading } from "@/app/_components/Heading/Heading";
import { Section } from "@/app/_components/Section/Section";
import { Marks } from "./Marks";
import styles from "./MarksHistory.module.css";

const TIMELINE = [
  {
    when: "before the 1600s",
    text: (
      <>
        Vietnamese is written with <span lang="vi">chữ Hán</span> (Chinese characters) and{" "}
        <span lang="vi">chữ Nôm</span>, a native script built on them. Tones are never marked: the
        character itself is the word.
      </>
    ),
  },
  {
    when: "1619 – 1623",
    text: (
      <>
        Francisco de Pina, a Portuguese Jesuit, compiles a first word list and a short treatise
        on spelling and sounds. He is credited as the first to describe the six tones in detail.
        Other Portuguese and Italian missionaries, and Vietnamese Catholics, work on the same
        problem: writing what they hear in Latin letters, with accents for the tones.
      </>
    ),
  },
  {
    when: "1651",
    text: (
      <>
        Alexandre de Rhodes prints his Vietnamese–Portuguese–Latin dictionary in Rome. It draws on
        the earlier work of Pina and other Portuguese Jesuits, which is why it is the best-known
        landmark of the script and not its first draft.
      </>
    ),
  },
  {
    when: "1915 – 1919",
    text: (
      <>
        Under French rule, Chinese characters leave the exam syllabus in 1915 and the old
        Confucian exams end in 1919. <span lang="vi">Chữ quốc ngữ</span>, the “national script”,
        takes over in schools. It is how every Vietnamese child now learns to write.
      </>
    ),
  },
  {
    when: "1954",
    text: (
      <>
        The linguist André-Georges Haudricourt shows where tones themselves come from: they grew
        out of the sounds around a word, with final consonants shaping the contour and initial
        consonants setting the height. The consonants later faded, and the tones stayed.
      </>
    ),
  },
] as const;

export function MarksHistory() {
  return (
    <Section id="s08" num="08" eyebrowVi="Dấu từ đâu đến" eyebrowEn="Where the marks came from">
      <Heading>
        A small accent, <em>a long story.</em>
      </Heading>

      <div className={styles.history}>
        <ol className={styles.timeline}>
          {TIMELINE.map((item) => (
            <li key={item.when}>
              <time>{item.when}</time>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.side}>
          <Marks />
        </div>
      </div>
    </Section>
  );
}
