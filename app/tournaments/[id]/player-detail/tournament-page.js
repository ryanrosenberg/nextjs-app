'use client'

import { usePathname, useSearchParams } from "next/navigation";
import NormalTable from "../../../../components/normal_table";
import { useMemo } from "react";
import Link from "next/link";
import _ from "lodash";
import styles from "../tournaments.module.css";
import { slug } from "../../../../lib/utils";
import NestedSideNav from "../../../../components/nested_side_nav";

export default function Tournament({ result }) {
  const data = result.props.result;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = pathname + searchParams.toString();
 
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

  let playerDetail = _.groupBy(data["Player Detail"], "team");
  let player_lookup = {};
  const player_names = _.map(data.Players, "raw_player");
  const player_slugs = _.map(data.Players, "slug");
  player_names.forEach((k, i) => {
    player_lookup[k] = player_slugs[i];
  });
  return (
    <>
      <div className="main-container">
        <NestedSideNav lowestLevel={3} />
        <div className="main-content">
          <h1 className="page-title">{data.Summary[0]["tournament_name"]}</h1>
          <p className="page-subtitle">{data.Summary[0]["date"]}</p>
          {data.Summary[0]["naqt_id"] ? (
            <p className="naqt-disclaimer">
              These results are NAQT's property, provided for research purposes
              only, and are not to be posted elsewhere without NAQT's
              permission. Results may also be accessed on NAQT's website{" "}
              <a href={`https://www.naqt.com/stats/tournament/standings.jsp?tournament_id=${data.Summary[0]["naqt_id"]}`}>here</a>.
            </p>
          ) : (
            <></>
          )}
          <ul className={styles.linkRow}>
            <li>
              <a href={url + '/../'}>Tournament Page</a>
            </li>
            <li>
              <a href={url + '/../team-detail'}>Team Detail</a>
            </li>
          </ul>
          <br></br>
          <h2></h2>
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
                        {player_lookup[player] ? (
                          <Link href={`../players/${player_lookup[player]}`}>
                            {player}
                          </Link>
                        ) : (
                          <p style={{ display: "inline" }}>{player}</p>
                        )}
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
    </>
  );
}
