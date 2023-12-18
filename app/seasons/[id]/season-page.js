"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import NormalTable from "../../../components/normal_table";

export default function Season({ result }) {
  const data = result.props.result;
  
  data.Tournaments.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US");
    return item;
  });

  data.Sets.map((item) => {
    switch (item.difficulty) {
      case "easy":
        item.difficulty = "<div class = 'diffdots easy-diff'>&#x25CF;</div>";
        break;
      case "medium":
        item.difficulty = "<div class = 'diffdots medium-diff'>&#x25CF;&#x25CF;</div>";
        break;
      case "regionals":
        item.difficulty = "<div class = 'diffdots regionals-diff'>&#x25CF;&#x25CF;&#x25CF;</div>";
        break;
      case "nationals":
        item.difficulty = "<div class = 'diffdots nationals-diff'>&#x25CF;&#x25CF;&#x25CF;&#x25CF;</div>";
        break;
      default:
        break;
    }
    return item;
  });

  const championsColumns = useMemo(() => [
    {
      Header: "Tournament",
      accessor: "tournament",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}",
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
      accessor: "tournament",
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
    },
  ]);

  const setsColumns = useMemo(() => [
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
      linkTemplate: "/sets/{{set_slug}}",
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      align: "left",
      border: "right",
      html: true
    },
    {
      Header: "Sites",
      accessor: "sites",
    },
    {
      Header: "Teams",
      accessor: "teams",
    },
    {
      Header: "Schools",
      accessor: "schools",
    },
  ]);

  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav lowestLevel={3} />
        </div>
        <div className="main-content">
          <p className="page-title">20{data.Tournaments[0].year}</p>
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
            grouping_column="date"
            itemsPerPage={10}
          />
        </div>
      </div>
    </>
  );
}
