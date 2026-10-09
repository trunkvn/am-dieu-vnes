import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/app/_lib/cx";
import styles from "./Button.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  solid?: boolean;
  /** icon-only circle */
  round?: boolean;
  small?: boolean;
};

export function Button({ solid, round, small, className, type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={cx(styles.btn, solid && styles.solid, round && styles.round, small && styles.small, className)}
      {...rest}
    />
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 1l11 6-11 6z" />
    </svg>
  );
}
