"use client";

import { Tournament } from "../types";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { FaBars } from "react-icons/fa";

type NavbarProps = {
  tournament?: Tournament;
};

export default function Navbar({ tournament }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!tournament) return <></>;

  let menuItems = [
    { label: "Tossups", url: `/buzzpoints/${tournament.slug}/tossup` },
    { label: "Bonuses", url: `/buzzpoints/${tournament.slug}/bonus` },
    { label: "Players", url: `/buzzpoints/${tournament.slug}/player` },
    { label: "Teams", url: `/buzzpoints/${tournament.slug}/team` },
    { label: "Categories (Tossup)", url: `/buzzpoints/${tournament.slug}/category-tossup` },
    { label: "Categories (Bonus)", url: `/buzzpoints/${tournament.slug}/category-bonus` },
  ];

  return (
    <nav className={`${styles.buzzpointNav} sticky`}>
      <div className="min-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className={styles.buzzpointNavFlex}>
          <div className={styles.buzzpointNavFlex}>
            <div className={styles.buzzpointNavTournament}>
              <Link
                className={`${styles.buzzpointNavLink}`}
                href={`/buzzpoints/${tournament.slug}`}
              >
                {tournament.name}
              </Link>
            </div>
            <div className="hidden md:block">
              <div className={styles.buzzpointNavFlex}>
                {menuItems.map(({ url, label }, i) => (
                  <Link
                    key={i}
                    className={`
                    ${styles.buzzpointNavLink}
                    ${
                      pathname.includes(url) ? styles.buzzpointNavLinkCurrent : ""
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
