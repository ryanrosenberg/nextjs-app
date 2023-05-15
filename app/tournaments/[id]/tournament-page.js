'use client'

import Link from "next/link";
import NormalTable from "../../../components/normal_table";
import PaginatedTable from "../../../components/paginated_table";
import StandingsTable from "../../../components/standings_table";
import { useMemo } from "react";
import _ from "lodash";
import styles from "./tournaments.module.css";
import { slug } from "../../../lib/utils";
import NestedSideNav from "../../../components/nested_side_nav";

export default function Tournament({ result }) {
  const data = result.props.result;
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
        Tooltip:
          "A-Value is a measure of a team's performance on a set compared to all other teams that played the set. It approximates how many points a team would be expected to score against the average team playing the set.",
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

  let teamDetailTeams = _.groupBy(data["Team Detail Teams"], "Team");
  let teamDetailPlayers = _.groupBy(data["Team Detail Players"], "Team");
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
          <hr />
          <h2 id="standings">Standings</h2>
          <StandingsTable
            grouping_column="bracket"
            columns={standingsColumns}
            data={data.Standings}
          />
          <hr />
          <h2 id="players">Players</h2>
          <PaginatedTable
            columns={playersColumns}
            data={data.Players}
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
                {teamDetailPlayers[team] ? (
                  <NormalTable
                    columns={teamDetailPlayerColumns}
                    data={teamDetailPlayers[team]}
                    className={styles.teamPlayerDetail}
                  />
                ) : (
                  ""
                )}
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
