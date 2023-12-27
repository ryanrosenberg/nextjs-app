import styles from "./tournaments.module.css";

export default function TournamentNavRow({ id, buzzpoints_slug = null }) {
  return (
    <ul className={styles.linkRow}>
      <li>
        <a href={`${id}/team-detail`}>Team Detail</a>
      </li>
      <li>
        <a href={`${id}/player-detail`}>Player Detail</a>
      </li>
      {
        buzzpoints_slug ?
          <li>
            <a href={`/buzzpoints/tournament/${buzzpoints_slug}`}>Detailed Stats</a>
          </li> : ""
      }
    </ul>
  );
}
