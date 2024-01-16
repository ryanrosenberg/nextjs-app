import Set from "./set-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  const sql = neon(process.env.DATABASE_URL);
  const sets = await sql`SELECT distinct set_slug from sets`;
  return sets;
}


export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: pageData.props.result.Summary[0].set_name + " | College Quizbowl Stats"
  };
}

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const summary_res = await sql`
  SELECT 
  sets.year as Year,
  sets.\"set\" as \"Set\", 
  difficulty, 
  category, 
  set_name, 
  headitor
  from sets
  left join editors on sets.set_id = editors.set_id
   WHERE sets.set_slug = ${params.id}
         `;

  const editor_res = await sql`
  SELECT 
  sets.year as Year,
  sets.\"set\" as \"Set\", 
  difficulty, 
  set_name,
  headitor,
  category, 
  subcategory as Subcategory, 
  string_agg(distinct editor, ', ') as Editors,
  string_agg(distinct slug, ', ') as slugs
  from sets
  LEFT JOIN editors on sets.set_id = editors.set_id
  LEFT JOIN people on editors.person_id = people.person_id
   WHERE sets.set_slug = ${params.id}
   and category != 'Head'
   GROUP BY 1,2,3,4,5, 6, 7`;

  const tournament_res = await sql`
  SELECT 
sets.year as Year, 
tournaments.date as Date, 
team_games.tournament_id,
\"set\" as \"Set\", 
site as Site, 
count(distinct team_id) as Teams,
count(distinct(team_games.school_id)) as Schools,
sum(powers)/sum(coalesce(tuh, 20))::numeric as \"15%\",
(sum(coalesce(powers,0))+sum(tens))/sum(coalesce(tuh, 20)/2)::numeric as \"Conv%\",
sum(bonus_pts)/nullif(sum(bonuses_heard), 0)::numeric as PPB
from team_games
LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
 LEFT JOIN sets on tournaments.set_id = sets.set_id
 LEFT JOIN sites on tournaments.site_id = sites.site_id
 WHERE sets.set_slug = ${params.id}
 GROUP BY 1,2,3,4, 5`;

  const teams_res = await sql`
  SELECT 
  sets.year as Year,
  coalesce(teams.team, school_name) as Team, 
  team_games.tournament_id, 
  schools.slug as school_slug,
  \"set\" as \"Set\", 
  site as Site, 
  count(game_id) as GP,
   sum(case result when 1 then 1 else 0 end) || '-' ||
   sum(case result when 0 then 1 else 0 end) as \"W-L\",
   sum(coalesce(tuh, 20)) as TUH,
   sum(powers) as \"15\", 
   sum(tens) as \"10\", 
   sum(negs) as \"-5\",
   sum(powers)/count(result)::numeric as \"15/G\",
   sum(tens)/count(result)::numeric as \"10/G\",
   sum(negs)/count(result)::numeric as \"-5/G\",
   (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
   avg(total_pts)::numeric as PPG, 
   sum(bonus_pts)/coalesce(sum(bonuses_heard), 0)::numeric as PPB,
   max(a_value) as \"A-Value\" 
  from team_games
   LEFT JOIN sets on team_games.set_id = sets.set_id
   LEFT JOIN sites on team_games.site_id = sites.site_id
   LEFT JOIN schools on team_games.school_id = schools.school_id
   LEFT JOIN teams on team_games.team_id = teams.team_id
   LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
             and team_games.team_id = tournament_results.team_id
             WHERE sets.set_slug = ${params.id}
   GROUP BY 1,2,3,4,5, 6`;

  const player_res = await sql`
  SELECT
  sets.year as Year, 
  \"set\" as \"Set\", 
  site as Site, 
  player_games.tournament_id,
  coalesce(fname|| ' ' || lname, player_games.player) as Player,
  team as Team, 
  slug,
  count(tens) as GP,
  sum(coalesce(tuh, 20)) as TUH,
  sum(powers) as \"15\", 
  sum(tens) as \"10\", 
  sum(negs) as \"-5\",
  sum(powers)/count(tens)::numeric as \"15/G\",
  sum(tens)/count(tens)::numeric as \"10/G\",
  sum(negs)/count(tens)::numeric as \"-5/G\",
  sum(powers)/nullif(sum(negs), 0)::numeric as \"P/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/nullif(sum(negs), 0)::numeric as \"G/N\",
  avg(pts)::numeric as PPG from
  player_games
  LEFT JOIN teams on player_games.team_id = teams.team_id
  LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on player_games.set_id = sets.set_id
  LEFT JOIN sites on player_games.site_id = sites.site_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  WHERE sets.set_slug = ${params.id}
GROUP BY 1,2,3,4,5, 6, 7
ORDER BY Player`;

  return {
    props: {
      result: {
        Summary: summary_res,
        'Teams': teams_res,
        'Players': player_res,
        'Tournaments': tournament_res,
        'Editors': editor_res
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Set result={pageData} />;
}
