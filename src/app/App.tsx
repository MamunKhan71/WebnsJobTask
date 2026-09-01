import type { ReactElement } from "react";
import styles from "./App.module.css";

export function App(): ReactElement {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Teamwork</h1>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainInner}>
        </div>
      </main>
    </>
  );
}
