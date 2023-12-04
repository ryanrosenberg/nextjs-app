import Home from "./home-page";
import { db as dbi } from "@vercel/postgres";

export const metadata = {
  title: "Home | College Quizbowl Stats",
};

export async function getData(params) {
  const client = await dbi.connect();
  const rt_res = await client.sql`
  SELECT tournaments.*, results.Champion FROM (SELECT 
    date as Date,
    sets.year, \"set\" as \"Set\", site as Site,
    \"set\" || ' at ' || site as Tournament, tournaments.tournament_id,
    count(distinct team_games.team_id) as Teams
    from team_games
    left join teams on team_games.team_id = teams.team_id
    left join tournaments on team_games.tournament_id = tournaments.tournament_id
    LEFT JOIN sets on tournaments.set_id = sets.set_id
    LEFT JOIN sites on tournaments.site_id = sites.site_id
    GROUP BY 1, 2, 3, 4, 5, 6
    ORDER BY Date desc
    LIMIT 10) tournaments
    LEFT JOIN
    (
        SELECT 
        date as Date,
        \"set\" || ' at ' || site as Tournament,
        max(teams.team) as Champion
        from team_games
        left join teams on team_games.team_id = teams.team_id
        left join tournaments on team_games.tournament_id = tournaments.tournament_id
        LEFT JOIN sets on tournaments.set_id = sets.set_id
        LEFT JOIN sites on tournaments.site_id = sites.site_id
        LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
        and team_games.team_id = tournament_results.team_id
        where rank = 1
        GROUP BY 1, 2
        ORDER BY Date desc
        LIMIT 10
    ) results
    on tournaments.Tournament = results.Tournament
           `;

  const tty_res = await client.sql`
            `;
  const all = {
    teamsThisYear: tty_res.rows,
    recentTournaments: rt_res.rows,
  };
  return {
    props: {
      result: all,
    },
  };
}
export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <Home result={pageData} />;
}
