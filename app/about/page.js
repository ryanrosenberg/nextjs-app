import styles from "./about.module.css"

export default function About() {
  
  return (
    <>
      <div>
        <p>
          Welcome to College Quizbowl Stats. This site has two intended
          purposes:
        </p>
        <ul>
          <li>
            To serve as a <b>repository</b> of quizbowl statistics, preserving
            records of the game’s playing history. This includes traditional
            statistics such as wins and losses, points per bonus, and
            powers/gets/negs; detailed statistics such as scoresheets, per-category
            statistics, conversion statistcs, and buzzpoints; and metadata about
            how the game was created and played, such as editing and hosting
            statistics.
          </li>
          <li>
            To serve as a <b>reference</b> for quizbowl statistics, enabling
            easy lookup of player stats, team strengths, tournament attendance,
            and whatever else ends up on the site. Above all, the site should be
            easy to access and use.
          </li>
        </ul>
        <h3 className={styles.header}>Status</h3>
        <p className={styles.paragraph}>
          Currently, the site includes all closed collegiate tournaments in the seasons from 2011-2012 to 2022-2023 that have posted stats, with the exception of those that only posted stats on Neg5 or that posted stats without a Scoreboard page. Open tournaments that were primarily composed of closed collegiate teams, as well as Chicago Open, were also included. If you know of a tournament that isn't included here that you believe should be, contact me at <a href="mailto:ryanr345@gmail.com">ryanr345@gmail.com</a>.
        </p>
        <h3 className={styles.header}>Data corrections and name changes</h3>
        <p className={styles.paragraph}>
          If you have any name changes or data corrections (e.g. two player entries who are actually the same player and should be combined, a team that's mislabeled) please email me at <a href="mailto:ryanr345@gmail.com">ryanr345@gmail.com</a> and I'll fix it ASAP.
        </p>
        <h3 className={styles.header}>Set difficulty</h3>
        <p className={styles.paragraph}>
          This site uses the same set difficulty notation as{" "}
          <a href="collegequizbowlcalendar.com">collegequizbowlcalendar.com</a>.
        </p>
        <h3 className={styles.header}>Future plans</h3>
        <p className={styles.paragraph}>
          An immediate priority is streamlining data ingestion so more tournaments can be added (both future tournaments and filling in more past tournaments). Eventually, I'd like the site to at least host stats from all available closed collegiate tournaments, and perhaps all open tournaments.
          <br></br>
          <br></br>
          This site is designed to be extensible: it can easily be configured to host additional data, such as detailed stats or player/team strength metrics. If you'd like to work on adding these, please contact me at <a href="mailto:ryanr345@gmail.com">ryanr345@gmail.com</a>.
        </p>
      </div>
    </>
  );
}
