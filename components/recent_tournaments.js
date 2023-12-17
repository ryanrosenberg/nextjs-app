import { sanitize, slugify } from "../lib/utils";
import GroupedTable from "./grouped_table";
import { useMemo } from "react";

export default function RecentTournaments({ data }) {
  data.map((item) => {
    item.date = new Date(item.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    item.team_slug = slugify(sanitize(item.champion));
    return item;
  });
  const columns = useMemo(() => [
    {
      Header: "Tournament",
      accessor: "tournament",
      align: "left",
      border: "right",
      linkTemplate: "/tournaments/{{tournament_id}}"
    },
    {
      Header: "Champion",
      accessor: "champion",
      align: "left",
      border: "right"
    },
    {
      Header: "Teams",
      accessor: "teams",
    },
  ]);

  return (
    <GroupedTable
      columns={columns}
      data={data}
      grouping_column="date"
      full_width={true}
    />
  );
}
