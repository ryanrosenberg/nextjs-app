import Layout from "../../components/layout";
import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import _ from "lodash";
import NormalTable from "../../components/normal_table";
import styles from "../../components/games.module.css";

export default function Game({ result }) {
  const teamColumns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "Player",
        align: "left",
        border: "right",
      },
      {
        Header: "15",
        accessor: "15",
      },
      {
        Header: "10",
        accessor: "10",
      },
      {
        Header: "-5",
        accessor: "-5",
        border: "right",
      },
      {
        Header: "Pts",
        accessor: "Pts",
      },
    ],
    []
  );

  
  var player_stats = _.groupBy(result.Players, "team");
  var team_stats = _.groupBy(result.Teams, "team");

  return (
    <Layout>
      <Head>
        <title>
          {result.Summary[0]["team"] +
            " vs. " +
            result.Summary[1]["team"] +
            " | College Quizbowl Stats"}
        </title>
      </Head>
      <div className="main-container">
        <div className="main-content">
          <h1 className="page-title">
            {`${result.Summary[0]["round"]}: ${result.Summary[0]["team"]} vs. ${result.Summary[1]["team"]}`}
          </h1>
          <p className="page-subtitle">
            <Link
              className={styles.tournamentLink}
              href={`../tournaments/${result.Summary[0]["tournament_id"]}`}
            >
              ← {result.Summary[0]["tournament_name"]}
            </Link>
          </p>
          <hr />
          <div className={styles.playerStatsRow}>
            {Object.keys(player_stats).map((team_name) => {
              
              return (
                <div className={styles.teamDiv}>
                  <h2 className={styles.teamName}>{team_name}</h2>
                  <p className={styles.teamScore}>
                    {team_stats[team_name][0]["total_pts"]}
                  </p>
                  <NormalTable
                    columns={teamColumns}
                    data={player_stats[team_name]}
                    footer={`${
                      team_stats[team_name][0]["bonuses_heard"]
                    } bonuses for ${
                      team_stats[team_name][0]["bonus_pts"]
                    } points (${
                      Math.round(
                        (100 * team_stats[team_name][0]["bonus_pts"]) /
                          team_stats[team_name][0]["bonuses_heard"],
                        2
                      ) / 100
                    } PPB)`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  // // Call an external API endpoint to get posts
  // const res = await fetch("https://cqs-backend.herokuapp.com/games");
  // const posts = await res.json();

  // // Get the paths we want to prerender based on posts
  // // In production environments, prerender all pages
  // // (slower builds, but faster initial page load)
  // const paths = posts.map((post) => ({
  //   params: { id: post.slug },
  // }));

  // { fallback: false } means other routes should 404
  // return { paths, fallback: false };
  
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getServerSideProps({ params }) {
  console.log(params.id);
  const sampleData = await fetch(
    "https://cqs-backend.herokuapp.com/games/" + params.id
  ).then((response) => response.json());
  return {
    props: {
      result: sampleData,
    },
  };
}
