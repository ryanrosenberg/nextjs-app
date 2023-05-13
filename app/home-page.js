'use client'

import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import RecentTournaments from "../components/recent_tournaments";
import TeamsThisYear from "../components/teams_this_year";
import styles from "../components/home_page.module.css";

export default function Home({ result }) {
  const data = result.props.result;
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.homepageFlex}>
        <div className={styles.homepageTeams}>
          <h2>Teams This Year</h2>
          <TeamsThisYear data = {data.teamsThisYear} />
        </div>
        <div className={styles.homepageTournaments}>
          <h2>Recent Tournaments</h2>
          <RecentTournaments data = {data.recentTournaments} />
        </div>
      </div>
    </Layout>
  );
}