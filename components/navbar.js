import Link from "next/link";
import styles from "./navbar.module.css";
import SearchBar from "./search_bar";

export default function Navbar() {

  return (
    <nav className={styles.topNav}>
      <ul>
        <li>
          <p className="site-title">
            <a href="/">College Quizbowl Stats</a>
          </p>
        </li>
        <li className={styles.search}>
          <SearchBar />
        </li>
        <li>
          <Link className={styles.navbarLink} href="/circuits/">
            Circuits
          </Link>
        </li>
        <li>
          <Link className={styles.navbarLink} href="/seasons/">
            Seasons
          </Link>
        </li>
        <li>
          <Link className={styles.navbarLink} href="/sets/">
            Sets
          </Link>
        </li>
        <li>
          <Link className={styles.navbarLink} href="/records/">
            Records
          </Link>
        </li>
        <li>
          <Link className={styles.navbarLink} href="/about/">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
