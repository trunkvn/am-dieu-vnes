import { Heading } from "@/app/_components/Heading/Heading";
import { Section } from "@/app/_components/Section/Section";
import { GiantWords } from "./GiantWords";
import styles from "./Ending.module.css";

const SOURCES = [
  {
    cite: "Fernandes, G. & Assunção, C. (2017). First codification of Vietnamese by 17th-century missionaries: the description of tones and the influence of Portuguese on Vietnamese orthography. Histoire Épistémologie Langage 39(1), 155–176.",
    href: "https://www.hel-journal.org/10.1051/hel/2017390108",
    for: "Pina, Rhodes and the first description of the six tones",
  },
  {
    cite: "Haudricourt, A.-G. (1954). De l’origine des tons en vietnamien. Journal Asiatique 242, 69–82. English translation: The origin of tones in Vietnamese.",
    href: "https://halshs.archives-ouvertes.fr/halshs-01678018",
    for: "where tones come from",
  },
  {
    cite: "Kirby, J. P. (2011). Illustrations of the IPA: Vietnamese (Hanoi Vietnamese). Journal of the International Phonetic Association 41, 381–392.",
    href: "https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/vietnamese-hanoi-vietnamese/31774A6EB2D510A1AAC7B0027FE520F4",
    for: "the Hanoi tones",
  },
  {
    cite: "Inquiries Journal: an article on the social impacts of French education reforms in Tonkin, 1906–1938.",
    href: "https://www.inquiriesjournal.com/articles/634/2/examing-the-social-impacts-of-french-education-reforms-in-tonkin-indochina-1906-1938",
    for: "the 1915–1919 exam changes (a student journal: check against a scholarly history)",
  },
] as const;

export function Ending() {
  return (
    <Section id="s09" num="09" eyebrowVi="Kết" eyebrowEn="The end">
      <Heading>
        Six voices, <em>one breath.</em>
      </Heading>

      <GiantWords />

      <p className={styles.lede}>
        A tone is not decoration. It is part of the word, the way a letter is.
      </p>
      <p className={styles.lede}>
        Next time someone says <span lang="vi">má</span>, listen to how far their voice travels
        before you hear the word. You have been doing this your whole life; now you can see it.
      </p>

      <div className={styles.stamp} lang="vi">
        Hết bài
      </div>

      <div className={styles.fine}>
        <p>
          <b>About this page.</b> The tones follow the Hanoi system, and the pitch curves are
          simplified shapes, not measurements. The recordings of the six words come from the
          Vietnamese tones page at{" "}
          <a href="https://phospeak.com/vietnamese-tones" target="_blank" rel="noopener noreferrer">
            phospeak.com
          </a>
          ; the “pitch only” sounds are synthesised glides. Your microphone recording stays in
          your browser. The pitch tracker cannot follow a creaky voice, so hỏi, ngã and nặng may be
          misread, and the Sài Gòn view only shows the one merge it is sure of.
        </p>
        <p>
          <b>Sources.</b> The history is summarised from the sources below. Check a detail against
          them before relying on it.
        </p>
        <ol className={styles.sources}>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.cite}
              </a>{" "}
              <span>For {s.for}.</span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
