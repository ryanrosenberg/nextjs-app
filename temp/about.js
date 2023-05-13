import Head from "next/head";
import Layout from "../components/layout";

export default function About() {
  
  return (
    <Layout home>
      <Head>
        <title>About | College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">About</h1>
        <h2>To-do</h2>
        <ul>
          <h4>Pre-release</h4>
          <li>add 2022-23 stats</li>
          <li>NAQT disclaimer</li>
          <li>put everything on Firebase</li>
          <li>mobile site</li>
          <li>App Router</li>
          <h4>Post-release</h4>
          <li>Circuit records</li>
          <li>player best games?</li>
        </ul>
        <p>
          Welcome to College Quizbowl Stats. This site has two intended
          purposes:
        </p>
        <ul>
          <li>
            To serve as a <b>repository</b> of quizbowl statistics, preserving
            records of the game’s playing history. This includes traditional
            statistics such as wins and losses, points per bonus, and
            powers/gets/negs; detailed statistics such as per-category
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
        <h2>Status</h2>
        <p>
          Currently, the site includes all tournaments in the seasons from
          2011-2012 to 2021-2022 that have posted stats, with the exception of
          those that only posted stats on Neg5 or that posted stats without a
          Scoreboard page. The below table summarizes the status of each
          competition year:
        </p>
        <h2>Set Difficulty</h2>
        <p>
          This site uses the same set difficulty notation as{" "}
          <a href="collegequizbowlcalendar.com">collegequizbowlcalendar.com</a>.
        </p>
      </div>
    </Layout>
  );
}
