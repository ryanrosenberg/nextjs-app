"use client";

import styles from "./tournaments.module.css";
import { usePathname } from "next/navigation";

export default function TournamentNavRow() {
  const pathname = usePathname();
  return (
    <ul className={styles.linkRow}>
      <li>
        <a href={pathname + "/team-detail"}>Team Detail</a>
      </li>
      <li>
        <a href={pathname + "/player-detail"}>Player Detail</a>
      </li>
    </ul>
  );
}
