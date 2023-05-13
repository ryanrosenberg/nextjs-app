import Link from "next/link";
import styles from "./navbar.module.css";
import SearchBar from "./search_bar";
import { FaBars } from "react-icons/fa"

export default function Navbar() {

  return (
    <nav className={styles.topNav}>
      <ul className={styles.mainNavList}>
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
      <ul className={styles.mobileNavList}>
        <li>
          <div className={styles.mobileTitle}>
            <a href="/">College Quizbowl Stats</a>
          </div>
        </li>
        <li>
          <a>
            <FaBars className={styles.barsIcon}/>
          </a>
        </li>
      </ul>
    </nav>
  );
}
