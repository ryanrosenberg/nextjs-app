'use client'

import { usePathname, useSearchParams } from "next/navigation";
import PaginatedTable from "../../../components/paginated_table";
import StandingsTable from "../../../components/standings_table";
import { useMemo } from "react";
import _ from "lodash";
import styles from "./tournaments.module.css";
import NestedSideNav from "../../../components/nested_side_nav";

export default function Tournament({ result }) {
  const data = result.props.result;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = pathname + searchParams.toString();
 
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

  let player_lookup = {};
  const player_names = _.map(data.Players, "raw_player");
  const player_slugs = _.map(data.Players, "slug");
  player_names.forEach((k, i) => {
    player_lookup[k] = player_slugs[i];
  });

  console.log(data.Players);

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
              <a href={url + '/team-detail'}>Team Detail</a>
            </li>
            <li>
              <a href={url + '/player-detail'}>Player Detail</a>
            </li>
          </ul>
          <h2 id="standings">Standings</h2>
          <StandingsTable
            grouping_column="bracket"
            columns={standingsColumns}
            data={data.Standings}
          />
          <br></br>
          <h2 id="players">Players</h2>
          <PaginatedTable
            columns={playersColumns}
            data={data.Players}
            itemsPerPage={10}
          />
        </div>
      </div>
    </>
  );
}
