"use client";

import RecentTournaments from "../components/recent_tournaments";
import TeamsThisYear from "../components/teams_this_year";
import styles from "../components/home_page.module.css";

export default function Home({ result }) {
  const data = result.props.result;
  return (
    <>
      <div className={styles.homepageFlex}>
        <div className={styles.homepageTeams}>
          <h2>Teams This Year</h2>
          <TeamsThisYear data={data.teamsThisYear} />
        </div>
        <div className={styles.homepageTournaments}>
          <h2>Recent Tournaments</h2>
          <RecentTournaments data={data.recentTournaments} />
        </div>
      </div>
      <hr></hr>
      <p style={{ color: "gray", fontSize: "20px" }}>
        This site contains data on {Intl.NumberFormat('en-US').format(data.games)} games from {Intl.NumberFormat('en-US').format(data.tournaments)} tournaments involving {Intl.NumberFormat('en-US').format(data.schools)} schools and {Intl.NumberFormat('en-US').format(data.players)} players.
      </p>
    </>
  );
}
