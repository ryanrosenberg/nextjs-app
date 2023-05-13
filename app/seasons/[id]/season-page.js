"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import NormalTable from "../../../components/normal_table";

export default function Season({ result }) {
  const data = result.props.result;
  const championsColumns = useMemo(() => [
    {
      Header: "Tournament",
      accessor: "Tournament",
      align: "left",
      border: "right",
    },
    {
      Header: "Site",
      accessor: "site",
      align: "left",
      border: "right",
    },
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
    },
    {
      Header: "Players",
      accessor: "players",
      align: "left",
    },
  ]);

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Tournament",
      accessor: "Tournament",
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
    },
  ]);

  const setsColumns = useMemo(() => [
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      align: "left",
      border: "right",
    },
    {
      Header: "Sites",
      accessor: "Sites",
    },
    {
      Header: "Teams",
      accessor: "Teams",
    },
    {
      Header: "Schools",
      accessor: "Schools",
    },
  ]);

  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav lowestLevel={3} />
        </div>
        <div className="main-content">
          <p className="page-title">{data.Tournaments[0].year}</p>
          <p className="page-subtitle"></p>
          <hr />
          <h2 id="editors">Champions</h2>
          <NormalTable data={data.Champions} columns={championsColumns} />
          <hr />
          <h2 id="sets">Sets</h2>
          <NormalTable columns={setsColumns} data={data.Sets} />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedPaginatedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            grouping_column="Date"
            itemsPerPage={10}
          />
        </div>
      </div>
    </>
  );
}
