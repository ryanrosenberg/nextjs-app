"use client";

import { useMemo } from "react";
import _ from "lodash";
import { formatDecimal, sanitize, slugify } from "../../../lib/utils.js";
import RawHtml from "../../../components/rawHtml";
import GroupedTable from "../../../components/grouped_table";
import NestedSideNav from "../../../components/nested_side_nav";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table.js";

export default function Player({ result }) {
  const data = result.props.result;
  
  data.Tournaments.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US");
    item.team_slug = slugify(sanitize(item.team))
    return item;
  });

  const yearsColumns = useMemo(
    () => [
      {
        Header: "Season",
        accessor: "year",
        border: "right",
      },
      {
        Header: "School",
        accessor: "school",
        align: "left",
        border: "right",
        linkTemplate: "/schools/{{school_slug}}"
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
        Header: "PPG",
        accessor: "ppg",
        format: formatDecimal,
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
      linkTemplate: "/tournaments/{{tournament_id}}"
    },
    {
      Header: "School",
      accessor: "school",
      align: "left",
      linkTemplate: "/schools/{{school_slug}}"
    },
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}/team-detail#{{team_slug}}",
    },
    {
      Header: "Finish",
      accessor: "finish",
      border: "right",
    },
    {
      Header: "GP",
      accessor: "gp",
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
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal,
    },
  ]);

  const buzzpointColumns = useMemo(() => [
    {
      Header: "Category",
      accessor: "category",
      align: "left",
      border: "right",
      linkTemplate: "/buzzpoints/{{tournament_slug}}/category-tossup/{{category_slug}}"
    },
    {
      Header: "Pts",
      accessor: "pts",
    }
  ]);

  const editingColumns = useMemo(() => [
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
      linkTemplate: "/sets/{{set_slug}}"
    },
    {
      Header: "Categories",
      accessor: "categories",
      align: "left",
    },
  ]);

  const subtitle = _.map(data.Years, "school")
    .filter((v, i, a) => a.indexOf(v) == i)
    .map((school, i) => (
      <span key={i}>
        {i > 0 && ", "}
        <RawHtml html={school} />
      </span>
    ));

  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav />
        </div>
        <div className="main-content">
          <h1 className="page-title">{data.Years[0].player}</h1>
          <p className="page-subtitle">{subtitle}</p>
          {data.Years.length > 0 && (
            <div>
              <hr />
              <h2 id="years">Years</h2>
              <GroupedTable
                columns={yearsColumns}
                data={data.Years}
                grouping_column="school"
              />
            </div>
          )}
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedPaginatedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            grouping_column="year"
            itemsPerPage={10}
          />
          {data.Buzzpoints.length > 0 && (
            <div>
              <hr />
              <h2 id="buzzpoints">Category Stats</h2>
              <GroupedTable
                columns={buzzpointColumns}
                data={data.Buzzpoints}
                grouping_column="tournament_name"
              />
            </div>
          )}
          {data.Editing.length > 0 && (
            <div>
              <hr />
              <h2 id="editing">Editing</h2>
              <GroupedTable
                columns={editingColumns}
                data={data.Editing}
                grouping_column="year"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
