import Home from "./home-page";
import { neon } from '@neondatabase/serverless';

export const metadata = {
  title: "Home | College Quizbowl Stats",
};

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);

  // const test = await sql`
  // SELECT * FROM tournaments
  // ORDER BY date desc
  // LIMIT 10`

  const rt_res = await sql`
  SELECT 
  tournaments.*, 
  results.Champion FROM (SELECT 
    date as Date,
    tournament_name as Tournament, 
    tournaments.tournament_id,
    count(distinct team_games.team_id) as Teams
    from team_games
    left join teams on team_games.team_id = teams.team_id
    left join tournaments on team_games.tournament_id = tournaments.tournament_id
    LEFT JOIN sets on tournaments.set_id = sets.set_id::numeric
    LEFT JOIN sites on tournaments.site_id = sites.site_id
    GROUP BY 1, 2, 3
    ORDER BY Date desc
    FETCH FIRST 10 ROWS WITH TIES) tournaments
    LEFT JOIN
    (
        SELECT 
        date as Date,
        tournament_name as Tournament,
        tournaments.tournament_id,
        max(teams.team) as Champion
        from team_games
        left join teams on team_games.team_id = teams.team_id
        left join tournaments on team_games.tournament_id = tournaments.tournament_id
        LEFT JOIN sets on tournaments.set_id = sets.set_id::numeric
        LEFT JOIN sites on tournaments.site_id = sites.site_id
        LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
        and team_games.team_id = tournament_results.team_id
        where rank = 1
        GROUP BY 1, 2, 3
        ORDER BY Date desc
        FETCH FIRST 10 ROWS WITH TIES
    ) results
    on tournaments.tournament_id = results.tournament_id
           `;

  const tty_res = await sql`
  SELECT 
  team as Team,
  school as School, 
  slug,
  count(distinct team_games.tournament_id) as Ts,
  count(result) as GP,
  sum(case result when 1 then 1 else 0 end) as W,
  sum(case result when 0 then 1 else 0 end) as L,
avg(result) as \"Win%\",
  sum(coalesce(tuh, 20)) as TUH,
sum(powers)/count(result)::numeric as \"15/G\",
sum(tens)/count(result)::numeric as \"10/G\",
sum(negs)/count(result)::numeric as \"-5/G\",
(sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
avg(total_pts)::numeric as PPG, 
sum(bonus_pts)/sum(bonuses_heard)::numeric as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  where sets.year = '24-25'
  and teams.school_id is not null
  GROUP BY 1,2,3
  ORDER BY W desc`;

  const games = await sql`
  SELECT 
  count(distinct game_id) as games
  from team_games`;

  const tournaments = await sql`
  SELECT 
  count(distinct tournament_id) as tournaments
  from team_games`;

  const schools = await sql`
  SELECT 
  count(distinct school_id) as schools
  from team_games`;

  const players = await sql`
  SELECT 
  count(distinct coalesce(slug, player_games.player_id::text)) as players
  from player_games
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  `;
  console.log(players);
    

  const all = {
    teamsThisYear: tty_res,
    recentTournaments: rt_res,
    games: games[0].games,
    tournaments: tournaments[0].tournaments,
    schools: schools[0].schools,
    players: players[0].players
  };
  // console.log(all);
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
