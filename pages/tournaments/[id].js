import Layout from "../../components/layout";
import Head from "next/head";
import Link from "next/link";
import NormalTable from "../../components/normal_table";
import PaginatedTable from "../../components/paginated_table";
import { useMemo } from "react";
import _ from "lodash";
import styles from "../../components/tournaments.module.css";
import { slug } from "../../lib/utils";
import NestedSideNav from "../../components/nested_side_nav";

export default function Tournament({ result }) {
  const standingsColumns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "Rank",
        border: "right",
      },
      {
        Header: "Team",
        accessor: "Team",
        align: "left",
        border: "right",
      },
      {
        Header: "School",
        accessor: "School",
        align: "left",
        border: "right",
      },
      {
        Header: "GP",
        accessor: "GP",
      },
      {
        Header: "W-L",
        accessor: "W-L",
      },
      {
        Header: "TUH",
        accessor: "TUH",
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
        Header: "15/G",
        accessor: "15/G",
      },
      {
        Header: "10/G",
        accessor: "10/G",
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
      },
      {
        Header: "TU%",
        accessor: "TU%",
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
      {
        Header: "PPB",
        accessor: "PPB",
        border: "right",
      },
      {
        Header: "A-Value",
        accessor: "A-Value",
        Tooltip: "A-Value is a measure of a team's performance on a set compared to all other teams that played the set. It approximates how many points a team would be expected to score against the average team playing the set."
      },
    ],
    []
  );

  const playersColumns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "Player",
        align: "left",
        border: "right",
      },
      {
        Header: "Team",
        accessor: "Team",
        align: "left",
        border: "right",
      },
      {
        Header: "GP",
        accessor: "GP",
      },
      {
        Header: "TUH",
        accessor: "TUH",
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
        Header: "15/G",
        accessor: "15/G",
      },
      {
        Header: "10/G",
        accessor: "10/G",
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
      },
      {
        Header: "P/N",
        accessor: "P/N",
      },
      {
        Header: "G/N",
        accessor: "G/N",
        border: "right",
      },
      {
        Header: "TU%",
        accessor: "TU%",
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
    ],
    []
  );

  const teamDetailColumns = useMemo(
    () => [
      {
        Header: "Rd",
        accessor: "Round",
        border: "right",
      },
      {
        Header: "Opponent",
        accessor: "Opponent",
        align: "left",
        border: "right",
      },
      {
        Header: "Result",
        accessor: "Result",
        align: "center",
        border: "right",
      },
      {
        Header: "PF",
        accessor: "PF",
      },
      {
        Header: "PA",
        accessor: "PA",
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
        Header: "TUH",
        accessor: "TUH",
      },
      {
        Header: "PPTUH",
        accessor: "PPTUH",
        border: "right",
      },
      {
        Header: "BHrd",
        accessor: "BHrd",
      },
      {
        Header: "BPts",
        accessor: "BPts",
        border: "right",
      },
      {
        Header: "PPB",
        accessor: "PPB",
      },
    ],
    []
  );

  const teamDetailPlayerColumns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "Player",
        align: "left",
        border: "right",
      },
      {
        Header: "GP",
        accessor: "GP",
      },
      {
        Header: "TUH",
        accessor: "TUH",
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
        Header: "15/G",
        accessor: "15/G",
      },
      {
        Header: "10/G",
        accessor: "10/G",
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
      },
      {
        Header: "P/N",
        accessor: "P/N",
      },
      {
        Header: "G/N",
        accessor: "G/N",
        border: "right",
      },
      {
        Header: "TU%",
        accessor: "TU%",
      },
      {
        Header: "Pts",
        accessor: "Pts",
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
    ],
    []
  );

  const playerDetailColumns = useMemo(
    () => [
      {
        Header: "Rd",
        accessor: "Round",
        border: "right",
      },
      {
        Header: "Opponent",
        accessor: "Opponent",
        align: "left",
        border: "right",
      },
      {
        Header: "Result",
        accessor: "Result",
        align: "center",
        border: "right",
      },
      {
        Header: "TUH",
        accessor: "TUH",
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

  let teamDetailTeams = _.groupBy(result["Team Detail Teams"], "Team");
  let teamDetailPlayers = _.groupBy(result["Team Detail Players"], "Team");
  let playerDetail = _.groupBy(result["Player Detail"], "team");

  let player_lookup = {};
  const player_names = _.map(result.Players, "raw_player");
  const player_slugs = _.map(result.Players, "slug");
  player_names.forEach((k, i) => {
    player_lookup[k] = player_slugs[i];
  });

  return (
    <Layout>
      <Head>
        <title>
          {result.Summary[0]["tournament_name"] + " | College Quizbowl Stats"}
        </title>
      </Head>
      <div className="main-container">
        <NestedSideNav lowestLevel={3} />
        <div className="main-content">
          <h1 className="page-title">{result.Summary[0]["tournament_name"]}</h1>
          <p className="page-subtitle">{result.Summary[0]["date"]}</p>
          <hr />
          <h2 id="standings">Standings</h2>
          <NormalTable columns={standingsColumns} data={result.Standings} />
          <hr />
          <h2 id="players">Players</h2>
          <PaginatedTable
            columns={playersColumns}
            data={result.Players}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="team-detail">Team Detail</h2>
          {Object.keys(teamDetailTeams).map((team) => {
            return (
              <div>
                <h3 className={styles.teamPlayerHeader} id={slug(team)}>
                  {team}
                </h3>
                <NormalTable
                  columns={teamDetailColumns}
                  data={teamDetailTeams[team]}
                  className={styles.teamDetail}
                />
                <br></br>
                <NormalTable
                  columns={teamDetailPlayerColumns}
                  data={teamDetailPlayers[team]}
                  className={styles.teamPlayerDetail}
                />
                <br></br>
                <hr />
              </div>
            );
          })}
          <h2 id="player-detail">Player Detail</h2>
          {Object.keys(playerDetail).map((team) => {
            const teamPlayers = _.groupBy(playerDetail[team], "player");
            return (
              <div key={slug(team)}>
                <h3 id={slug(team) + "-players"} className={styles.teamHeader}>
                  {team}
                </h3>
                <hr style={{ width: "100%" }} />
                {Object.keys(teamPlayers).map((player) => {
                  return (
                    <div key={slug(player)}>
                      <h4
                        className={styles.teamPlayerHeader}
                        id={
                          slug(player) +
                          "-" +
                          slug(teamPlayers[player][0]["team"])
                        }
                      >
                        <Link href={`../players/${player_lookup[player]}`}>
                          {player}
                        </Link>
                        , {teamPlayers[player][0]["team"]}
                      </h4>
                      <NormalTable
                        columns={playerDetailColumns}
                        data={teamPlayers[player]}
                      />
                      <br></br>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("http://127.0.0.1:5000/tournaments");
  const posts = await res.json();

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  const paths = posts.map((post) => ({
    params: { id: post.slug },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const sampleData = await fetch(
    "http://127.0.0.1:5000/tournaments/" + params.id
  ).then((response) => response.json());
  return {
    props: {
      result: sampleData,
    },
  };
}
