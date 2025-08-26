import { sql, getTournamentsQuery } from "../../../lib/queries";
import NormalTable from "../../../components/normal_table";
import _ from "lodash";

export default async function Home() {
  const tournaments = await sql(getTournamentsQuery);
  let tournaments_by_year = Object.groupBy(
    tournaments.filter(
      (tournament) => (tournament.start_date)
    ),
    (tournament) => tournament.year
  )


  tournaments.map((item) => {
    item.start_date = new Date(item.start_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    item.end_date = new Date(item.end_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return item;
  })

  const columns = [
    {
      accessor: "name",
      Header: "Tournament",
      border: "right",
      linkTemplate: "/buzzpoints/tournament/{{slug}}"
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
      <h2>Tournaments with Detailed Stats</h2>
      {
        Object.keys(tournaments_by_year).map(
          (key) => (
            <div key = {key}>
              <h3>{key}</h3>
              <NormalTable
                columns={columns}
                data={tournaments_by_year[key]}
              />
            </div>

          )
        )
      }

    </>
  );
}