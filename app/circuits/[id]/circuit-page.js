"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import PaginatedTable from "../../../components/paginated_table";
import NormalTable from "../../../components/normal_table"
import NestedSideNav from "../../../components/nested_side_nav";
import dynamic from "next/dynamic";
import { slugify, sanitize, formatPercent, formatComma, formatDecimal } from "../../../lib/utils";
import styles from "./circuits.module.css";

export default function Circuit({ result }) {
  const data = result.props.result;
  
  data.Tournaments.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return item;
  });
  const schoolsColumns = useMemo(
    () => [
      {
        Header: "School",
        accessor: "school",
        align: "left",
        border: "right",
        linkTemplate: "/schools/{{school_slug}}"
      },
      {
        Header: "Yrs",
        accessor: "yrs",
      },
      {
        Header: "Ts",
        accessor: "ts",
        border: "right",
      },
      {
        Header: "GP",
        accessor: "gp",
      },
      {
        Header: "W-L",
        accessor: "W-L",
      },
      {
        Header: "Win%",
        accessor: "Win%",
        format: formatPercent
      },
      {
        Header: "TUH",
        accessor: "tuh",
        border: "right",
        format: formatComma
      },
      {
        Header: "15",
        accessor: "15",
        format: formatComma,
      },
      {
        Header: "10",
        accessor: "10",
        format: formatComma,
      },
      {
        Header: "-5",
        accessor: "-5",
        border: "right",
        format: formatComma,
      },
      {
        Header: "15/G",
        accessor: "15/G",
        format: formatDecimal
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
        Header: "TU%",
        accessor: "TU%",
        border: "right",
        format: formatPercent,
      },
      {
        Header: "PPG",
        accessor: "ppg",
        format: formatDecimal
      },
      {
        Header: "PPB",
        accessor: "ppb",
        format: formatDecimal
      },
    ],
    []
  );

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Date",
      accessor: "date",
      border: "right",
    },
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      linkTemplate: "/sets/{{set_slug}}"
    },
    {
      Header: "Site",
      accessor: "site",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}",
    },
    {
      Header: "Teams",
      accessor: "teams",
    },
    {
      Header: "Schools",
      accessor: "schools",
      border: "right",
    },
    {
      Header: "Champion",
      accessor: "champion",
      align: "left",
    },
  ]);

  const mostWinsColumns = useMemo(() => [
    {
      Header: "School",
      accessor: "School",
      align: "left",
      border: "right",
      linkTemplate: "/schools/{{slug}}"
    },
    {
      Header: "Ts",
      accessor: "tournaments",
    },
    {
      Header: "Wins",
      accessor: "wins",
      format: formatComma,
    },
  ]);

  const highestWinPct = useMemo(() => [
    {
      Header: "Team",
      accessor: "Team",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "tournaments",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      format: formatPercent,
      digits: 2
    },
  ]);

  const playerPtsColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "player",
      align: "left",
      border: "right",
      linkTemplate: "/players/{{slug}}"
    },
    {
      Header: "Schools",
      accessor: "schools",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "ts",
    },
    {
      Header: "GP",
      accessor: "gp",
      border: "right",
    },
    {
      Header: "Pts",
      accessor: "pts",
      format: formatComma
    },
  ]);

  const playerPctColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "player",
      align: "left",
      border: "right",
      linkTemplate: "/players/{{slug}}"
    },
    {
      Header: "Schools",
      accessor: "schools",
      align: "left",
      border: "right",
    },
    {
      Header: "GP",
      accessor: "gp",
      border: "right",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      format: formatPercent,
      digits: 2
    },
  ]);

  const playerTsColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "player",
      align: "left",
      border: "right",
      linkTemplate: "/players/{{slug}}"
    },
    {
      Header: "Schools",
      accessor: "schools",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "ts",
    }
  ]);

  const MapWithNoSSR = dynamic(() => import("./leaflet-map"), {
    ssr: false,
  });

  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav />
        </div>
        <div className="main-content">
          <h1 className="page-title">{data.Tournaments[0]["circuit"]}</h1>
          <div id="map">
            <MapWithNoSSR
              school_markers={data.Schools}
              host_markers={data.Sites}
            />
          </div>
          <p style={{ fontSize: "1.2em", textAlign: "left" }}>
            Blue markers represent schools that have hosted tournaments. Faded
            markers represent inactive schools (i.e. have not played/hosted
            since 2021.)
          </p>
          <hr />
          <h2 id="schools">Schools</h2>
          <PaginatedTable
            columns={schoolsColumns}
            data={data.Schools}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedPaginatedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            grouping_column="year"
            itemsPerPage={10}
          />
          <hr />
          <h2 id="records">Records</h2>
          <h3
            style={{
              textDecoration: "underline",
              textUnderlineOffset: ".25em",
            }}
          >
            School Records
          </h3>
          <div className={styles.recordsRow}>
            <div className={styles.recordsCol}>
              <h4>Most Wins</h4>
              <NormalTable
                columns={mostWinsColumns}
                data={data.Records["Most Wins"]}
              />
            </div>
            <div className={styles.recordsCol}>
              <h4>Highest Winning %</h4>
              <NormalTable
                columns={highestWinPct}
                data={data.Records["Highest Winning %"]}
                footer={"Min. 10 tournaments played"}
              />
            </div>
            <div className={styles.recordsCol}>
              <h4>Most Tournament Wins</h4>
              <NormalTable
                columns={mostWinsColumns}
                data={data.Records["Most Tournament Wins"]}
              />
            </div>
          </div>

          <h3
            style={{
              textDecoration: "underline",
              textUnderlineOffset: ".25em",
            }}
          >
            Player Records
          </h3>
          <div className={styles.recordsRow}>
            <div className={styles.recordsCol}>
              <h4>Most Points</h4>
              <NormalTable
                columns={playerPtsColumns}
                data={data.Records["Most Player Pts"]}
              />
            </div>
            <div className={styles.recordsCol}>
              <h4>Highest Player Winning %</h4>
              <NormalTable
                columns={playerPctColumns}
                data={data.Records["Highest Player Winning %"]}
                footer={"Min. 50 games played"}
              />
            </div>
            <div className={styles.recordsCol}>
              <h4>Most Tournaments Played</h4>
              <NormalTable
                columns={playerTsColumns}
                data={data.Records["Most Tournaments Played"]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
