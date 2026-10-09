import type { HTMLAttributes } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./Slip.module.css";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** which way the slip leans */
  tilt?: "left" | "right";
};

/** A taped-on slip of paper. */
export function Slip({ tilt, className, ...rest }: Props) {
  return (
    <div
      className={cx(
        styles.slip,
        tilt === "left" && styles.tiltLeft,
        tilt === "right" && styles.tiltRight,
        className,
      )}
      {...rest}
    />
  );
}
