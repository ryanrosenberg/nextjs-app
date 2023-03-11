import PaginatedTable from "./paginated_table";
import { useMemo } from "react";

const TeamsThisYear = ({ data }) => {
  const teamsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "Team",
      align: "left",
      border: "right",
    },
    {
      Header: "School",
      accessor: "School",
      align: "left",
      border: "right",
    },
    {
      Header: "Ts",
      accessor: "Ts",
      border: "right",
      Tooltip: "Tournaments played"
    },
    {
      Header: "GP",
      accessor: "GP",
      border: "right",
    },
    {
      Header: "W",
      accessor: "W",
    },
    {
      Header: "L",
      accessor: "L",
      border: "right",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      border: "right",
    },
    {
      Header: "TUH",
      accessor: "TUH",
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
      Tooltip: "Percent of tossups heard that the team answered correctly"
    },
    {
      Header: "PPG",
      accessor: "PPG",
    },
    {
      Header: "PPB",
      accessor: "PPB",
    },
  ]);

  return(<PaginatedTable columns={teamsColumns} data={data} itemsPerPage={10} full_width = {true}/>);
};

export default TeamsThisYear;
