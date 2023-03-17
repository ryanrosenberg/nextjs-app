import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import RecentTournaments from "../components/recent_tournaments";
import TeamsThisYear from "../components/teams_this_year";

export default function Home({ result }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className='homepage-flex'>
        <div className="homepage-teams">
          <h2>Teams This Year</h2>
          <TeamsThisYear data = {result.teamsThisYear} />
        </div>
        <div className="homepage-tournaments">
          <h2>Recent Tournaments</h2>
          <RecentTournaments data = {result.recentTournaments} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const tty = await fetch(
    "https://cqs-backend.herokuapp.com/teams/thisyear"
  ).then((response) => response.json());
  const rt = await fetch(
    "https://cqs-backend.herokuapp.com/tournaments/recent"
  ).then((response) => response.json());
  return {
    props: {
      result: {'teamsThisYear': tty, 'recentTournaments': rt}
    },
  };
}
