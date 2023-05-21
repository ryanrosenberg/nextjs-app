"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import NormalTable from "../../../components/normal_table";
import PaginatedTable from "../../../components/paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import dynamic from "next/dynamic";
import styles from "./circuits.module.css";

export default function Circuit({ result }) {
  const data = result.props.result;
  const schoolsColumns = useMemo(
    () => [
      {
        Header: "School",
        accessor: "School",
        align: "left",
        border: "right",
      },
      {
        Header: "Yrs",
        accessor: "Yrs",
      },
      {
        Header: "Ts",
        accessor: "Ts",
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
        Header: "Win%",
        accessor: "Win%",
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
        border: "right",
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
      {
        Header: "PPB",
        accessor: "PPB",
      },
    ],
    []
  );

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Date",
      accessor: "Date",
      border: "right",
    },
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
    },
    {
      Header: "Site",
      accessor: "Site",
      align: "left",
      border: "right",
    },
    {
      Header: "Teams",
      accessor: "Teams",
    },
    {
      Header: "Schools",
      accessor: "Schools",
      border: "right",
    },
    {
      Header: "Champion",
      accessor: "Champion",
      align: "left",
    },
  ]);

  const mostWinsColumns = useMemo(() => [
    {
      Header: "School",
      accessor: "School",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "Tournaments",
    },
    {
      Header: "Wins",
      accessor: "Wins",
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
      accessor: "Tournaments",
    },
    {
      Header: "Win%",
      accessor: "Win%",
    },
  ]);

  const playerPtsColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "Player",
      align: "left",
      border: "right",
    },
    {
      Header: "Schools",
      accessor: "Schools",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "Ts",
    },
    {
      Header: "GP",
      accessor: "GP",
      border: "right",
    },
    {
      Header: "Pts",
      accessor: "Pts",
    },
  ]);

  const playerPctColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "Player",
      align: "left",
      border: "right",
    },
    {
      Header: "Schools",
      accessor: "Schools",
      align: "left",
      border: "right",
    },
    {
      Header: "GP",
      accessor: "GP",
      border: "right",
    },
    {
      Header: "Win%",
      accessor: "Win%",
    },
  ]);

  const playerTsColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "Player",
      align: "left",
      border: "right",
    },
    {
      Header: "Schools",
      accessor: "Schools",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "Ts",
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
          <h1 className="page-title">{data.Tournaments[0]["Circuit"]}</h1>
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
            grouping_column="Year"
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
              <h4>Most Wins</h4>
              <NormalTable
                columns={playerPtsColumns}
                data={data.Records["Most Player Pts"]}
              />
            </div>
            <div className={styles.recordsCol}>
              <h4>Highest Winning %</h4>
              <NormalTable
                columns={playerPctColumns}
                data={data.Records["Highest Player Winning %"]}
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
