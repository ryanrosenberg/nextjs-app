"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import PaginatedTable from "../../../components/paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import dynamic from "next/dynamic";

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
        </div>
      </div>
    </>
  );
}
