'use client'

import Link from "next/link";
import { useMemo } from "react";
import _ from "lodash";
import NormalTable from "../../../components/normal_table";
import styles from "./games.module.css";

export default function Game({ result }) {
  const data = result.props.result;
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

  
  var player_stats = _.groupBy(data.Players, "team");
  var team_stats = _.groupBy(data.Teams, "team");

  return (
      <div className="main-container">
        <div className="main-content">
          <h1 className="page-title">
            {`${data.Summary[0]["round"]}: ${data.Summary[0]["team"]} vs. ${data.Summary[1]["team"]}`}
          </h1>
          <p className="page-subtitle">
            <Link
              className={styles.tournamentLink}
              href={`../tournaments/${data.Summary[0]["tournament_id"]}`}
            >
              ← {data.Summary[0]["tournament_name"]}
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
  );
}

