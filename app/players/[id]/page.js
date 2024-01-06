import Player from "./player-page";
import { neon } from '@neondatabase/serverless';


export async function generateStaticParams() {
  // // Call an external API endpoint to get posts
  // const res = await fetch("https://cqs-backend.herokuapp.com/players");
  // const posts = await res.json();

  // const paths = posts.map((post) => ({
  //   id: post.slug,
  // }));

  // return paths;
  return [];
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Years[0].player} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);

  const years_res = await sql`
  SELECT
  sets.year as Year,
  people.player as Player,
  school_name as School, 
  schools.slug as school_slug,
  count(distinct tournaments.tournament_id) as Ts,
  count(tens) as GP,
  sum(coalesce(tuh, 20)) as TUH,
  sum(coalesce(powers, 0)) as \"15\", 
  sum(tens) as \"10\", 
  sum(negs) as \"-5\",
  avg(coalesce(powers, 0)) as \"15/G\",
  avg(tens) as \"10/G\",
  avg(negs) as \"-5/G\",
  (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(count(negs), 0)::numeric as \"G/N\",
  avg(pts) as PPG from
  player_games
  LEFT JOIN schools on player_games.school_id = schools.school_id::varchar
  LEFT JOIN teams on player_games.team_id = teams.team_id
  LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  INNER JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
   where people.slug = ${params.id}
  and teams.school is not null
  GROUP BY 1, 2, 3, 4
  ORDER BY 1`;

  const tournaments_res = await sql`
  SELECT
  sets.year as Year,
  date as Date,
  \"set\" as \"Set\", 
  tournaments.tournament_id,
  site as Site,
  teams.school as School, 
  schools.slug as school_slug, 
  sets.set_slug as set_slug,
  coalesce(teams.team, school_name) as Team,
  rank || '/' || CAST(num_teams as int) as Finish,
  count(tens) as GP,
  sum(coalesce(tuh, 20)) as TUH,
  sum(powers) as \"15\", 
  sum(tens) as \"10\", 
  sum(negs) as \"-5\",
  sum(powers)/NULLIF(count(tens), 0)::numeric as \"15/G\",
  sum(tens)/NULLIF(count(tens), 0)::numeric as \"10/G\",
  sum(negs)/NULLIF(count(tens), 0)::numeric as \"-5/G\",
  sum(powers)/NULLIF(sum(negs), 0)::numeric as \"P/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(sum(negs), 0)::numeric as \"G/N\",
  avg(pts) as PPG from
  player_games
  LEFT JOIN schools on player_games.school_id = schools.school_id::varchar
  LEFT JOIN teams on player_games.team_id = teams.team_id
  LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
  LEFT JOIN tournament_results on player_games.tournament_id = tournament_results.tournament_id
  and player_games.team_id = tournament_results.team_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  INNER JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  WHERE people.slug = ${params.id}
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ORDER BY 2 desc`;

  const editing_res = await sql`
  SELECT 
  year as Year, \"set\" as \"Set\", 
  sets.set_slug, 
  string_agg(subcategory, ', ') as Categories
  from editors
  LEFT JOIN sets on editors.set_id = sets.set_id
  LEFT JOIN people on editors.person_id = people.person_id
  WHERE slug = ${params.id}
  GROUP BY 1, 2, 3`;

  return {
    props: {
      result: {
        Years: years_res,
        'Tournaments': tournaments_res,
        'Editing': editing_res
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Player result={pageData} />;
}
