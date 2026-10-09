import type { HTMLAttributes } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./Note.module.css";

/** A red-pen margin note. */
export function Note({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx(styles.note, className)} {...rest} />;
}
