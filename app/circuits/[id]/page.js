// Import your Client Component
import Circuit from "./circuit-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  const sql = neon(process.env.DATABASE_URL);
  const circuits = await sql`
  SELECT distinct circuit_slug from schools 
  where circuit is not null
  and circuit <> 'National'
  and circuit <> 'Asia'`;

  return circuits;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Tournaments[0]["circuit"]} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const schools_res = await sql`
  SELECT 
  school_name as School, 
  slug as school_slug, 
  schools.lat, 
  schools.lon, 
  schools.school_id,
  min(EXTRACT(YEAR FROM tournaments.date::date)) || '-' || max(EXTRACT(YEAR FROM tournaments.date::date)) as Yrs,
  coalesce(cast(EXTRACT(YEAR FROM max(tournaments.date::date)) as int), 2000) as last_active,
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

  const sites_res = await sql`
  SELECT 
  sites.site, 
  sites.lat, 
  sites.lon, 
  sites.school_id,
coalesce(cast(EXTRACT(YEAR FROM max(tournaments.date::date)) as int), 2000) as last_host
from sites
 LEFT JOIN tournaments on sites.site_id = tournaments.site_id
 WHERE sites.circuit_slug = ${params.id}
 and sites.lat is not null
 GROUP BY 1, 2, 3, 4
 `;

  const tournament_res = await sql`
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
sum(powers)/sum(coalesce(tuh, 20)) as pct_power,
(sum(coalesce(powers,0))+sum(tens))/sum(coalesce(tuh, 20)/2) as pct_conv,
sum(bonus_pts)/sum(bonuses_heard) as PPB
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

 const team_wins = await sql`
 SELECT 
 school_name as \"School\", 
 slug,
 count(distinct tournament_id) as Tournaments,
 sum(case result when 1 then 1 else 0 end) as Wins
 from team_games
 left join schools on team_games.school_id = schools.school_id
 left join sets on team_games.set_id = sets.set_id
 left join sites on team_games.site_id = sites.site_id
 where team_games.school_id is not null
 and school_name is not null
 and sites.circuit_slug = ${params.id}
 GROUP BY 1, 2
 ORDER BY Wins desc
 LIMIT 10`;

 const team_pct = await sql`
 SELECT 
 a.*
 FROM (SELECT team as \"Team\", 
count(distinct tournament_id) as Tournaments,
avg(result) as \"Win%\"
from team_games
left join schools on team_games.school_id = schools.school_id
left join teams on team_games.team_id = teams.team_id
left join sets on team_games.set_id = sets.set_id
left join sites on team_games.site_id = sites.site_id
where schools.open is null and schools.high_school is null
and team_games.school_id is not null
and sites.circuit_slug = ${params.id}
GROUP BY 1) a
WHERE Tournaments >= 10
ORDER BY 3 desc
LIMIT 10`;
 const team_ts = await sql`
 SELECT 
  school_name as \"School\", 
  slug,
  count(distinct tournament_results.tournament_id) as Tournaments,
  sum(case rank when 1 then 1 else 0 end) as Wins
  from tournament_results
  left join teams on tournament_results.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  left join tournaments on tournament_results.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school_id is not null
  and sites.circuit_slug = ${params.id}
  GROUP BY 1, 2
  ORDER BY Wins desc
  LIMIT 10`;

 const player_pts = await sql`
 SELECT fname || ' ' || lname as Player, 
 slug,
 replace(string_agg(distinct teams.school, ', '), ',', ', ') as Schools,
 count(distinct tournament_id) as Ts,
 count(tournament_id) as GP,
 sum(pts) as Pts
 from player_games
 left join teams on player_games.team_id = teams.team_id
 left join sets on player_games.set_id = sets.set_id
 LEFT JOIN players on player_games.player_id = players.player_id
 LEFT JOIN people on players.person_id = people.person_id
 left join sites on player_games.site_id = sites.site_id
 where teams.school_id is not null
 and sites.circuit_slug = ${params.id}
 and fname is not null
 GROUP BY 1, 2
 ORDER BY Pts desc
 LIMIT 10`;
 const player_pct = await sql`
 select a.* from (
  SELECT fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct teams.school, ', '), ',', ', ') as Schools,
  count(player_games.game_id) as GP,
  avg(result) as \"Win%\"
  from player_games
  left join (select game_id, team_id, result from team_games) results on player_games.team_id = results.team_id and player_games.game_id = results.game_id
  left join teams on player_games.team_id = teams.team_id
  left join sets on player_games.set_id = sets.set_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  left join sites on player_games.site_id = sites.site_id
  where teams.school_id is not null
  and sites.circuit_slug = ${params.id}
  and fname is not null
  GROUP BY 1, 2
  ORDER BY 5 desc) a
  where GP >= 50
  LIMIT 10`;
 const player_ts = await sql`
 SELECT 
 fname || ' ' || lname as Player, 
 slug,
 replace(string_agg(distinct teams.school, ', '), ',', ', ') as Schools,
 count(distinct tournament_id) as Ts
 from player_games
 left join teams on player_games.team_id = teams.team_id
 left join sets on player_games.set_id = sets.set_id
 LEFT JOIN players on player_games.player_id = players.player_id
 LEFT JOIN people on players.person_id = people.person_id
 left join sites on player_games.site_id = sites.site_id
 where teams.school_id is not null
 and sites.circuit_slug = ${params.id}
 and fname is not null
 GROUP BY 1, 2
 ORDER BY Ts desc
 LIMIT 10`;

  return {
    props: {
      result: {
        Schools: schools_res,
        Sites: sites_res,
        Tournaments: tournament_res,
        Records: {
          "Most Wins": team_wins,
          "Highest Winning %": team_pct,
          "Most Tournament Wins": team_ts,
          "Most Player Pts": player_pts,
          "Highest Player Winning %": player_pct,
          "Most Tournaments Played": player_ts,
        }
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
