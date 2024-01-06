"use client";

import PaginatedTable from "../../../components/paginated_table";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import { useMemo } from "react";
import _ from "lodash";
import NestedSideNav from "../../../components/nested_side_nav";
import NormalTable from "../../../components/normal_table";
import { slugify, sanitize, formatComma, formatDecimal, formatPercent } from "../../../lib/utils";

export default function Team({ result }) {
  const data = result.props.result;
  
  data.Tournaments.map((item) => {
    item.team_slug = slugify(sanitize(item.team));
    return item;
  });
  data.Hosting.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return item;
  });

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}/team-detail#{{team_slug}}",
    },
    {
      Header: "Players",
      accessor: "players",
      align: "left",
      border: "right",
    },
    {
      Header: "Finish",
      accessor: "finish",
      border: "right",
    },
    {
      Header: "GP",
      accessor: "gp",
    },
    {
      Header: "W-L",
      accessor: "W-L",
      border: "right",
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
      format: formatDecimal,
    },
    {
      Header: "PPB",
      accessor: "ppb",
      border: "right",
      format: formatDecimal,
    },
    {
      Header: "A-Value",
      accessor: "A-Value",
      format: formatDecimal,
    },
  ]);

  const teamsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
    },
    {
      Header: "Tmnts",
      accessor: "tmnts",
      border: "right",
      format: formatComma,
    },
    {
      Header: "GP",
      accessor: "gp",
      format: formatComma,
    },
    {
      Header: "TUH",
      accessor: "tuh",
      border: "right",
      format: formatComma,
    },
    {
      Header: "W-L",
      accessor: "W-L",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      border: "right",
      format: formatPercent,
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
      Header: "TU%",
      accessor: "TU%",
      border: "right",
      format: formatPercent,
    },
    {
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal,
    },
    {
      Header: "PPB",
      accessor: "ppb",
      format: formatDecimal,
    },
  ]);

  const playersColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "player",
      align: "left",
      border: "right",
      linkTemplate: "/players/{{person_slug}}",
    },
    {
      Header: "Yrs",
      accessor: "yrs",
      border: "right",
    },
    {
      Header: "Tmnts",
      accessor: "tmnts",
    },
    {
      Header: "GP",
      accessor: "gp",
      format: formatComma,
    },
    {
      Header: "TUH",
      accessor: "tuh",
      border: "right",
      format: formatComma,
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
      Header: "TU%",
      accessor: "TU%",
      border: "right",
      format: formatPercent,
    },
    {
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal,
    },
  ]);

  const hostingColumns = useMemo(() => [
    {
      Header: "Date",
      accessor: "date",
      border: "right",
    },
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
    },
    {
      Header: "Teams",
      accessor: "teams",
      linkTemplate: "/tournaments/{{tournament_id}}"
    },
  ]);

  const yearsColumns = useMemo(() => [
    {
      Header: "Year",
      accessor: "year",
      border: "right",
      linkTemplate: "/seasons/{{year}}",
    },
    {
      Header: "Tmnts",
      accessor: "tmnts",
      border: "right",
    },
    {
      Header: "Teams",
      accessor: "teams",
    },
    {
      Header: "Players",
      accessor: "players",
      border: "right",
    },
    {
      Header: "Nats",
      accessor: "ACF Nats",
      border: "right",
    },
    {
      Header: "ICT",
      accessor: "DI ICT",
    },
  ]);

  return (
    <>
      <div className="main-container">
        <NestedSideNav lowestLevel={3} />
        <div className="main-content">
          <h1 className="page-title">{data.Summary[0].school}</h1>
          <p className="page-subtitle">{data.Summary[0].circuit}</p>
          <hr />
          <h2 id="years">Years</h2>
          <NormalTable
            columns={yearsColumns}
            data={data.Summary}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="teams">Teams</h2>
          <PaginatedTable
            columns={teamsColumns}
            data={data.Teams}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="players">Players</h2>
          <PaginatedTable
            columns={playersColumns}
            data={data.Players}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedPaginatedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            itemsPerPage={10}
            grouping_column="tournament"
          />
          {data.Hosting.length > 0 && (
            <div>
              <hr />
              <h2 id="hosting">Hosting</h2>
              <GroupedPaginatedTable
                columns={hostingColumns}
                data={data.Hosting}
                itemsPerPage={10}
                grouping_column="year"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
