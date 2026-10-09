import { Heading } from "@/app/_components/Heading/Heading";
import { Note } from "@/app/_components/Note/Note";
import { Section } from "@/app/_components/Section/Section";
import { Quiz } from "./Quiz";
import styles from "./ListenChoose.module.css";

export function ListenChoose() {
  return (
    <Section id="s06" num="06" eyebrowVi="Nghe và chọn" eyebrowEn="Listen and choose">
      <Heading>
        Which one did <em>you hear?</em>
      </Heading>
      <p className={styles.lede}>
        One sound plays. Pick the word. Start with tones that sit far apart, then move on to the
        pairs that fool everyone.
      </p>
      <Quiz />
      <p className={styles.fact}>
        <Note>
          fun fact: <span lang="vi">hỏi</span> and <span lang="vi">ngã</span> trip up even native
          speakers. In the south the two sound identical, so people spell them from memory.
        </Note>
      </p>
    </Section>
  );
}
