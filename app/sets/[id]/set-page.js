"use client";

import { useMemo } from "react";
import _ from "lodash";
import GroupedTable from "../../../components/grouped_table";
import PaginatedTable from "../../../components/paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import { formatDecimal, formatPercent, sanitize, slugify } from "../../../lib/utils";

export default function Set({ result }) {
  const data = result.props.result;
  const mergeEditorSlugs = (editors, slugs) => {
    let editor_list = editors.split(', ')
    let slug_list = slugs.split(', ')
    let link_list = slug_list.map((item, i) => `<a href = '/players/${item}'>${editor_list[i]}</a>`)
    return link_list.join(', ')
  }
  data.Editors.map((item) => {
    item.editor_links = mergeEditorSlugs(item.editors, item.slugs)
    return item;
  });  
  data.Tournaments.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return item;
  });
  data.Teams.map((item) => {
    item.team_slug = sanitize(slugify(item.team))
  });
  data.Players.map((item) => {
    item.player_slug = sanitize(slugify(item.player))
    item.team_slug = sanitize(slugify(item.team))
  });

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Site",
      accessor: "site",
      align: "left",
      border: "right",
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
      Header: "15%",
      accessor: "15%",
      format: formatPercent,
      digits: 1
    },
    {
      Header: "Conv%",
      accessor: "Conv%",
      border: "right",
      format: formatPercent,
      digits: 1
    },
    {
      Header: "PPB",
      accessor: "ppb",
      format: formatDecimal,
      digits: 2
    },
  ]);

  const teamsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}/team-detail#{{team_slug}}"
    },
    {
      Header: "Site",
      accessor: "site",
      border: "right",
      datatype: "string",
      linkTemplate: "/tournaments/{{tournament_id}}/"
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
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "10/G",
      accessor: "10/G",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "-5/G",
      accessor: "-5/G",
      border: "right",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "TU%",
      accessor: "TU%",
      border: "right",
      format: formatPercent,
      digits: 2,
    },
    {
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "PPB",
      accessor: "ppb",
      border: "right",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "A-Value",
      accessor: "A-Value",
      format: formatDecimal,
      digits: 2,
    },
  ]);

  const playersColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "player",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}/player-detail#{{player_slug}}-{{team_slug}}"
    },
    {
      Header: "Team",
      accessor: "team",
      border: "right",
      datatype: "string",
      linkTemplate: "/tournaments/{{tournament_id}}/team-detail#{{team_slug}}"
    },
    {
      Header: "Site",
      accessor: "site",
      border: "right",
      datatype: "string",
      linkTemplate: "/tournaments/{{tournament_id}}"
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
      digits: 2,
    },
    {
      Header: "10/G",
      accessor: "10/G",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "-5/G",
      accessor: "-5/G",
      border: "right",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "P/N",
      accessor: "P/N",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "G/N",
      accessor: "G/N",
      border: "right",
      format: formatDecimal,
      digits: 2,
    },
    {
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal,
      digits: 2,
    },
  ]);

  const editorsColumns = useMemo(() => [
    {
      Header: "Subcategory",
      accessor: "subcategory",
      align: "left",
      border: "right",
    },
    {
      Header: "Editors",
      accessor: "editor_links",
      align: "left",
      html: 'true'
    },
  ]);

  switch (data.Summary[0].difficulty) {
    case "easy":
      var diffdot = "<div class = 'diffdots easy-diff'>&#x25CF;</div>";
      break;
    case "medium":
      var diffdot =
        "<div class = 'diffdots medium-diff'>&#x25CF;&#x25CF;</div>";
      break;
    case "regionals":
      var diffdot =
        "<div class = 'diffdots regionals-diff'>&#x25CF;&#x25CF;&#x25CF;</div>";
      break;
    case "nationals":
      var diffdot =
        "<div class = 'diffdots nationals-diff'>&#x25CF;&#x25CF;&#x25CF;&#x25CF;</div>";
      break;
  }

  return (
    <>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav lowestLevel={3} />
        </div>
        <div className="main-content">
          <div className="page-title">
            {data.Summary[0].set_name + " "}
            <div
              style={{ display: "inline" }}
              dangerouslySetInnerHTML={{ __html: diffdot }}
            ></div>
          </div>
          <p className="page-subtitle">
            Head Editor: {data.Summary[0].headitor}
          </p>
          <hr />
          <h2 id="editors">Editors</h2>
          <GroupedTable
            columns={editorsColumns}
            data={data.Editors}
            grouping_column="category"
          />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            grouping_column="date"
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
        </div>
      </div>
    </>
  );
}