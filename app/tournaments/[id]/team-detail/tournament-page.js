'use client'

import NormalTable from "../../../../components/normal_table";
import { useMemo } from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import _ from "lodash";
import styles from "../tournaments.module.css";
import { slug } from "../../../../lib/utils";
import NestedSideNav from "../../../../components/nested_side_nav";

export default function Tournament({ result }) {
  const data = result.props.result;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = pathname + searchParams.toString();
 
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

  let teamDetailTeams = _.groupBy(data["Team Detail Teams"], "Team");
  let teamDetailPlayers = _.groupBy(data["Team Detail Players"], "Team");

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
              <a href = {url + '/../'}>Tournament Page</a>
            </li>
            <li>
              <a href = {url + '/../team-detail'}>Team Detail</a>
            </li>
          </ul>
          <br></br>
          <h2 id="team-detail"></h2>
          {Object.keys(teamDetailTeams).map((team, i) => {
            return (
              <div key = {i}>
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
        </div>
      </div>
    </>
  );
}
