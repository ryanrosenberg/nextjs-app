import Head from "next/head";
import styles from "./layout.module.css";
import Navbar from "./navbar.js";

export const siteTitle = "College Quizbowl Stats";

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main>
        {children}
      </main>
    </div>
  );
}
