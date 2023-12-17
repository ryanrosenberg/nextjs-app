import { formatDecimal, formatPercent } from "../lib/utils";
import PaginatedTable from "./paginated_table";
import { useMemo } from "react";
import { slugify, sanitize } from "../lib/utils";

const TeamsThisYear = ({ data }) => {
  data.map((item) => {
    item.team_slug = slugify(sanitize(item.school));
    return item;
  });
  const teamsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "team",
      align: "left",
      border: "right",
    },
    {
      Header: "School",
      accessor: "school",
      align: "left",
      border: "right",
      linkTemplate: "/schools/{{team_slug}}"
    },
    {
      Header: "Ts",
      accessor: "ts",
      border: "right",
      Tooltip: "Tournaments played"
    },
    {
      Header: "GP",
      accessor: "gp",
      border: "right",
    },
    {
      Header: "W",
      accessor: "w",
    },
    {
      Header: "L",
      accessor: "l",
      border: "right",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      border: "right",
      format: formatPercent
    },
    {
      Header: "TUH",
      accessor: "tuh",
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
      format: formatDecimal
    },
    {
      Header: "-5/G",
      accessor: "-5/G",
      border: "right",
      format: formatDecimal
    },
    {
      Header: "TU%",
      accessor: "TU%",
      border: "right",
      format: formatPercent,
      Tooltip: "Percent of tossups heard that the team answered correctly"
    },
    {
      Header: "PPG",
      accessor: "ppg",
      format: formatDecimal
    },
    {
      Header: "PPB",
      accessor: "ppb",
      format: formatDecimal
    },
  ]);

  return(<PaginatedTable columns={teamsColumns} data={data} itemsPerPage={10} full_width = {true}/>);
};

export default TeamsThisYear;
