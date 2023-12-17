"use client";

import NormalTable from "../../../../components/normal_table";
import { Suspense, useMemo } from "react";
import _ from "lodash";
import styles from "../tournaments.module.css";
import {
  sanitize,
  slugify,
  formatDecimal,
  formatPercent,
} from "../../../../lib/utils";
import NestedSideNav from "../../../../components/nested_side_nav";

export default function Tournament({ result }) {
  const data = result.props.result;

  let teamDetailTeams = _.groupBy(
    data["Team Detail Teams"].map((item) => {
      item.opponent_slug = slugify(sanitize(item.opponent));
      return item;
    }),
    "team"
  );
  let teamDetailPlayers = _.groupBy(
    data["Team Detail Players"].map((item) => {
      item.team_slug = slugify(sanitize(item.team));
      item.player_slug = slugify(sanitize(item.player));
      return item;
    }),
    "team"
  );

  const teamDetailColumns = useMemo(
    () => [
      {
        Header: "Rd",
        accessor: "round",
        border: "right",
      },
      {
        Header: "Opponent",
        accessor: "opponent",
        align: "left",
        border: "right",
        linkTemplate: "#{{opponent_slug}}",
      },
      {
        Header: "Result",
        accessor: "result",
        align: "center",
        border: "right",
        linkTemplate: "/games/{{game_id}}",
      },
      {
        Header: "PF",
        accessor: "pf",
      },
      {
        Header: "PA",
        accessor: "pa",
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
        accessor: "tuh",
      },
      {
        Header: "PPTUH",
        accessor: "pptuh",
        border: "right",
        format: formatDecimal,
      },
      {
        Header: "BHrd",
        accessor: "bhrd",
      },
      {
        Header: "BPts",
        accessor: "bpts",
        border: "right",
      },
      {
        Header: "PPB",
        accessor: "ppb",
        format: formatDecimal,
      },
    ],
    []
  );

  const teamDetailPlayerColumns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "player",
        align: "left",
        border: "right",
        linkTemplate: "player-detail#{{player_slug}}-{{team_slug}}",
      },
      {
        Header: "GP",
        accessor: "gp",
      },
      {
        Header: "TUH",
        accessor: "tuh",
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
        format: formatDecimal,
      },
      {
        Header: "10/G",
        accessor: "10/G",
        format: formatDecimal,
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
        format: formatDecimal,
      },
      {
        Header: "P/N",
        accessor: "P/N",
        format: formatDecimal,
      },
      {
        Header: "G/N",
        accessor: "G/N",
        border: "right",
        format: formatDecimal,
      },
      {
        Header: "TU%",
        accessor: "TU%",
        format: formatPercent,
      },
      {
        Header: "Pts",
        accessor: "pts",
      },
      {
        Header: "PPG",
        accessor: "ppg",
        format: formatDecimal,
      },
    ],
    []
  );

  return (
    <>
      <div className="main-container">
        <Suspense>
          <NestedSideNav lowestLevel={3} />
        </Suspense>
        <div className="main-content">
          <h1 className="page-title">{data.Summary[0]["tournament_name"]}</h1>
          <p className="page-subtitle">
            {data.Summary[0]["date"].toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {data.Summary[0]["naqt_id"] ? (
            <p className="naqt-disclaimer">
              These results are NAQT's property, provided for research purposes
              only, and are not to be posted elsewhere without NAQT's
              permission. Results may also be accessed on NAQT's website{" "}
              <a
                href={`https://www.naqt.com/stats/tournament/standings.jsp?tournament_id=${data.Summary[0]["naqt_id"]}`}
              >
                here
              </a>
              .
            </p>
          ) : (
            <></>
          )}
          <ul className={styles.linkRow}>
            <li>
              <a href=".">Tournament Page</a>
            </li>
            <li>
              <a href="./team-detail">Team Detail</a>
            </li>
          </ul>
          <br></br>
          <h2 id="team-detail"></h2>
          {Object.keys(teamDetailTeams).map((team, i) => {
            return (
              <div key={i}>
                <h3
                  className={styles.teamPlayerHeader}
                  id={slugify(sanitize(team))}
                >
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
        </div>
      </div>
    </>
  );
}
