"use client";

import { QuestionSet, Tournament } from "../types";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { FaBars } from "react-icons/fa";

type NavbarProps = {
  tournament?: Tournament;
  questionSet?: QuestionSet;
};

export default function Navbar({ tournament, questionSet }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  let mainButton = (
    <Link className="text-white font-bold" href={"/"}>
      Buzzpoints
    </Link>
  );
  let menuItems: any[] = [];

  if (tournament) {
    menuItems.push(
      ...[
        {
          label: "Tossups",
          url: `/buzzpoints/tournament/${tournament.slug}/tossup`,
        },
        {
          label: "Bonuses",
          url: `/buzzpoints/tournament/${tournament.slug}/bonus`,
        },
        {
          label: "Players",
          url: `/buzzpoints/tournament/${tournament.slug}/player`,
        },
        {
          label: "Teams",
          url: `/buzzpoints/tournament/${tournament.slug}/team`,
        },
        {
          label: "Categories (Tossup)",
          url: `/buzzpoints/tournament/${tournament.slug}/category-tossup`,
        },
        {
          label: "Categories (Bonus)",
          url: `/buzzpoints/tournament/${tournament.slug}/category-bonus`,
        },
      ]
    );
    mainButton = (
      <Link
        className={styles.buzzpointNavLink}
        href={`/buzzpoints/tournament/${tournament.slug}`}
      >
        {tournament.name}
      </Link>
    );
  } else if (questionSet) {
    menuItems.push(
      ...[
        { label: "Tossups", url: `/buzzpoints/set/${questionSet.slug}/tossup` },
        { label: "Bonuses", url: `/buzzpoints/set/${questionSet.slug}/bonus` },
      ]
    );
    mainButton = (
      <Link
        className={styles.buzzpointNavLink}
        href={`/buzzpoints/set/${questionSet.slug}`}
      >
        {questionSet.name}
      </Link>
    );
  }

  return (
    <nav className={`${styles.buzzpointNav} sticky`}>
      <div className="min-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className={styles.buzzpointNavFlex}>
          <div className={styles.buzzpointNavFlex}>
            <div className={styles.buzzpointNavTournament}>
              <div className="flex-shrink-0">{mainButton}</div>
            </div>
            <div className="hidden md:block">
              <div className={styles.buzzpointNavFlex}>
                {menuItems.map(({ url, label }, i) => (
                  <Link
                    key={i}
                    className={`
                    ${styles.buzzpointNavLink}
                    ${
                      pathname.includes(url)
                        ? styles.buzzpointNavLinkCurrent
                        : ""
                    }`}
                    href={url}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className={styles.buzzpointNavFlex}></div>
          </div>
          <div className={styles.buzzpointNavBars}>
            <a onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars className={styles.barsIcon} />
            </a>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden">
          <div className={styles.buzzpointNavMobile}>
            {menuItems.map(({ url, label }, i) => (
              <Link
                key={i}
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                href={url}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
