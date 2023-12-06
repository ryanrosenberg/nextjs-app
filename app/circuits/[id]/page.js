// Import your Client Component
import Circuit from "./circuit-page";
import { db as dbi } from "@vercel/postgres";

export async function generateStaticParams() {
  const client = await dbi.connect();
  const circuits = await client.sql`
  SELECT distinct circuit_slug from schools 
  where circuit is not null
  and circuit <> 'National'
  and circuit <> 'Asia'`;

  return circuits.rows;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Tournaments[0]["circuit"]} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const client = await dbi.connect();
  const schools_res = await client.sql`
  SELECT 
  school_name as School, 
  slug as school_slug, 
  schools.lat, 
  schools.lon, 
  schools.school_id,
  min(EXTRACT(YEAR FROM tournaments.date)) || '-' || max(EXTRACT(YEAR FROM tournaments.date)) as Yrs,
  coalesce(cast(EXTRACT(YEAR FROM max(tournaments.date)) as int), 2000) as last_active,
  count(distinct tournaments.tournament_id) as Ts,
  count(game_id) as GP,
   sum(case result when 1 then 1 else 0 end) || '-' ||
   sum(case result when 0 then 1 else 0 end) as \"W-L\",
   avg(result) as \"Win%\",
   sum(coalesce(tuh, 20)) as TUH,
   sum(powers) as \"15\", sum(tens) as \"10\", sum(negs) as \"-5\",
   sum(powers)/count(result)::numeric as \"15/G\",
   sum(tens)/count(result)::numeric as \"10/G\",
   sum(negs)/count(result)::numeric as \"-5/G\",
   (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
   avg(total_pts)::numeric as PPG, 
   sum(bonus_pts)/sum(bonuses_heard)::numeric as PPB
  from team_games
  LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
   LEFT JOIN sets on team_games.set_id = sets.set_id
   LEFT JOIN sites on team_games.site_id = sites.site_id
   LEFT JOIN schools on team_games.school_id = schools.school_id
   LEFT JOIN teams on team_games.team_id = teams.team_id
   WHERE sites.circuit_slug = ${params.id}
   and schools.circuit_slug = ${params.id}
   GROUP BY 1, 2, 3, 4, 5
         `;

  const sites_res = await client.sql`
  SELECT 
  sites.site, 
  sites.lat, 
  sites.lon, 
  sites.school_id,
coalesce(cast(EXTRACT(YEAR FROM max(tournaments.date)) as int), 2000) as last_host
from sites
 LEFT JOIN tournaments on sites.site_id = tournaments.site_id
 WHERE sites.circuit_slug = ${params.id}
 and sites.lat is not null
 GROUP BY 1, 2, 3, 4
 `;
  const champs_res = await client.sql`

`;
  const tournament_res = await client.sql`
  SELECT 
  sites.circuit as Circuit,
sets.year as Year, 
tournaments.date as Date,
\"set\" as \"Set\", 
set_slug,
\"set\" || ' at ' || site as Tournament, 
team_games.tournament_id,
site as Site, 
Champion,
count(distinct team_id) as Teams,
count(distinct(team_games.school_id)) as Schools,
round(sum(powers)/sum(coalesce(tuh, 20)), 3) as pct_power,
round((sum(coalesce(powers,0))+sum(tens))/sum(coalesce(tuh, 20)/2), 3) as pct_conv,
round(sum(bonus_pts)/sum(bonuses_heard), 2) as PPB
from team_games
LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
 LEFT JOIN sets on tournaments.set_id = sets.set_id
 LEFT JOIN sites on tournaments.site_id = sites.site_id
 LEFT JOIN (  
  SELECT 
  date as Date,
  coalesce(\"set\" || ' at ' || site, '') as Tournament, 
  team_games.tournament_id,
  teams.team as Champion
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
  and team_games.team_id = tournament_results.team_id
  where rank = 1
  and sites.circuit_slug = ${params.id}
  ) champs 
  on tournaments.tournament_id = champs.tournament_id
 WHERE sites.circuit_slug = ${params.id}
 GROUP BY 1,2,3,4, 5, 6, 7, 8, 9
 ORDER by Date desc
 `;

  return {
    props: {
      result: {
        Schools: schools_res.rows,
        Sites: sites_res.rows,
        Champions: champs_res.rows,
        Tournaments: tournament_res.rows,
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Circuit result={pageData} />;
}
