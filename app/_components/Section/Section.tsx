import type { ReactNode } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./Section.module.css";

type Props = {
  id: string;
  /** margin number, e.g. "01" */
  num: string;
  eyebrowVi: string;
  eyebrowEn: string;
  /** squared (graph) paper instead of ruled lines */
  graph?: boolean;
  /** less top padding, for the first section under the cover */
  first?: boolean;
  children: ReactNode;
};

export function Section({ id, num, eyebrowVi, eyebrowEn, graph, first, children }: Props) {
  return (
    <section
      id={id}
      data-snap
      className={cx(styles.sec, graph && styles.graph, first && styles.first)}
    >
      <div className={styles.num}>{num}</div>
      <div className={styles.body}>
        <p className={styles.eyebrow}>
          <span lang="vi">{eyebrowVi}</span> · {eyebrowEn}
        </p>
        {children}
      </div>
    </section>
  );
}
