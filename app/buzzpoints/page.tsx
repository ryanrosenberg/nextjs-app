import { getTournamentsQuery } from "../../lib/queries";
import NormalTable from "../../components/normal_table";

export default function Home() {
  const tournaments = getTournamentsQuery.all();
  const columns = [
    {
      accessor: "name",
      Header: "Tournament",
      border: "right",
      linkTemplate: "/buzzpoints/{{slug}}/tossup"
    },
    {
      accessor: "location",
      Header: "Location"
    },
    {
      accessor: "level",
      Header: "Level"
    },
    {
      accessor: "start_date",
      Header: "Date",
      defaultSort: "desc" as const
    }
  ];

  return (
    <>
      <h3>Recent Tournaments with Detailed Stats</h3>
      <NormalTable
        columns={columns}
        data={tournaments}
         />
    </>
  );
}