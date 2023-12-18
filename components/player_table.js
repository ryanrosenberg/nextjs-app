import _ from "lodash";
import { formatDecimal } from "../lib/utils";
import { useMemo } from "react";
import PaginatedTable from "./paginated_table";

export default function PlayerTable({ data, id, itemsPerPage }) {

  const columns = useMemo(
    () => [
      {
        Header: "Player",
        accessor: "player",
        align: "left",
        border: "right",
        linkTemplate: id + "/player-detail#{{player_slug}}-{{team_slug}}",
      },
      {
        Header: "Team",
        accessor: "team",
        align: "left",
        border: "right",
        linkTemplate: id + "/team-detail#{{team_slug}}",
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
        Header: "TU%",
        accessor: "TU%",
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

  return (
    <PaginatedTable data={data} columns={columns} itemsPerPage={itemsPerPage} />
  );
}
