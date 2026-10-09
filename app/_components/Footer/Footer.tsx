import styles from "./Footer.module.css";

/** The line under the notebook. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Made by <b>Gnoud</b>
      </p>
    </footer>
  );
}
