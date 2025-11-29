"use client";

import Link from "next/link";
import { useMemo } from "react";
import _ from "lodash";
import NormalTable from "../../../components/normal_table";
import styles from "./games.module.css";
import BuzzpointScoresheet from "../../../components/buzzpoint_scoresheet"
import { slugify, sanitize } from "../../../lib/utils";

export default function Game({ result }) {
  const data = result.props.result;
  
  data.Players.map((item) => {
    item.team_slug = slugify(sanitize(item.team));
    item.player_slug = slugify(sanitize(item.player));
    return item;
  });
  const teamColumns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "player",
        align: "left",
        border: "right",
        linkTemplate: "/tournaments/{{tournament_id}}/player-detail#{{player_slug}}-{{team_slug}}"
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
        accessor: "pts",
      },
    ],
    []
  );

  var player_stats = _.groupBy(data.Players, "team");
  var team_stats = _.groupBy(data.Teams, "team");

  return (
    <div className="main-container">
      <div className="main-content">
        <Link
          className={styles.tournamentLink}
          href={`../tournaments/${data.Summary[0]["tournament_id"]}`}
        >
          ← {data.Summary[0]["tournament_name"]}
        </Link>
        <h1 className="page-title">
          {`${data.Summary[0]["round"]}: ${data.Summary[0]["team"]} vs. ${data.Summary[1]["team"]}`}
        </h1>
        <p className="page-subtitle"></p>
        <hr />
        <div className={styles.playerStatsRow}>
          {Object.keys(player_stats).map((team_name, i) => {
            return (
              <div className={styles.teamDiv} key={i}>
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
        <br/>
        {
          data.Buzzes.length > 0 ?
          <BuzzpointScoresheet 
          buzzes={data.Buzzes} 
          bonuses={data.Bonuses} 
          packet={data.Packet}
          players={data.Players} /> : ""
        }
      </div>
    </div>
  );
}
