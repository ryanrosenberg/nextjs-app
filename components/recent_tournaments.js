import GroupedTable from "./grouped_table";
import { useMemo } from "react";

export default function RecentTournaments({ data }) {
  const columns = useMemo(() => [
    {
      Header: "Tournament",
      accessor: "Tournament",
      align: "left",
      border: "right"
    },
    {
      Header: "Champion",
      accessor: "Champion",
      align: "left",
      border: "right"
    },
    {
      Header: "Teams",
      accessor: "Teams",
    },
  ]);

  return (
    <GroupedTable columns = {columns} data = {data} grouping_column = 'Date' full_width={true}/>
  );

}