import type { HTMLAttributes } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./Heading.module.css";

/** A scene's main title. */
export function Heading({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cx(styles.heading, className)} {...rest} />;
}
