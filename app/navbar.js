"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import SearchBar from "./search_bar";
import { FaBars } from "react-icons/fa";
import classnames from "classnames";
import { useState } from "react";

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  return (
    <nav className={styles.topNav}>
      <ul className={styles.mobileNavList}>
        <li>
          <div className={styles.mobileTitle}>
            <a href="/">College Quizbowl Stats</a>
          </div>
        </li>
        <li>
          <a
            onClick={() => {
              setIsNavExpanded(!isNavExpanded);
            }}
          >
            <FaBars className={styles.barsIcon} />
          </a>
        </li>
      </ul>
      <ul
        className={classnames(
          styles.mainNavList,
          isNavExpanded ? styles.mobileNavExpanded : ""
        )}
      >
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
