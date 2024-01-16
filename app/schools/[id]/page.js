import School from "./school-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  const sql = neon(process.env.DATABASE_URL);
  const schools = await sql`
  SELECT slug from 
  team_games
  left join teams on team_games.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
              where slug is not null
              and school_name is not null
           `;

  return schools;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]["school"]} | College Quizbowl Stats`,
  };
}

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const summary_res = await sql`
  SELECT school_name as School, schools.circuit as Circuit,
  sets.year as Year,
  count(distinct player_games.tournament_id) as Tmnts,
  max(tournament_teams) as Teams,
  count(distinct player_id) as Players,
  min(nats_rank) as \"ACF Nats\", max(nats_id), max(ict_id),
  min(ict_rank) as \"DI ICT\" from 
  player_games
  LEFT JOIN schools on player_games.school_id = schools.school_id
  LEFT JOIN teams on player_games.team_id = teams.team_id
  LEFT JOIN (
    SELECT tournament_id, 
    count(distinct team_id) as tournament_teams 
    from team_games 
    LEFT JOIN schools on team_games.school_id = schools.school_id 
    WHERE slug = ${params.id} 
    GROUP BY 1) tournament_teams 
    on player_games.tournament_id = tournament_teams.tournament_id
  LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  LEFT JOIN (SELECT sets.year as Year, rank as nats_rank, tournament_results.tournament_id as nats_id
  FROM tournament_results
  LEFT JOIN tournaments on tournament_results.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN teams on tournament_results.team_id = teams.team_id
  LEFT JOIN schools on teams.school_id = schools.school_id
  WHERE \"set\" = 'ACF Nationals'
  and slug = ${params.id}) nats on sets.year = nats.year
  LEFT JOIN (SELECT sets.year as Year, rank as ict_rank, tournament_results.tournament_id as ict_id
  FROM tournament_results
  LEFT JOIN tournaments on tournament_results.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN teams on tournament_results.team_id = teams.team_id
  LEFT JOIN schools on teams.school_id = schools.school_id
  WHERE \"set\" = 'DI ICT'
  and slug = ${params.id}) ict on sets.year = ict.year
  WHERE slug = ${params.id}
  GROUP BY 1, 2, 3
  ORDER BY 3 desc
         `;

  const teams_res = await sql`SELECT 
  team as Team,
  count(distinct team_games.tournament_id) as Tmnts,
  count(result) as GP,
  sum(case result when 1 then 1 else 0 end) || '-' ||
  sum(case result when 0 then 1 else 0 end) as \"W-L\",
  avg(result) as \"Win%\",
  sum(coalesce(tuh, 20)) as TUH,
  sum(powers) as \"15\", 
  sum(tens) as \"10\", 
  sum(negs) as \"-5\",
  sum(powers)/count(result)::numeric as \"15/G\",
  sum(tens)/count(result)::numeric as \"10/G\",
  sum(negs)/count(result)::numeric as \"-5/G\",
  (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
  avg(total_pts) as PPG, 
  sum(bonus_pts)/sum(bonuses_heard)::numeric as PPB from 
  team_games
  LEFT JOIN schools on team_games.school_id = schools.school_id
  LEFT JOIN teams on team_games.team_id = teams.team_id
  LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  WHERE slug = ${params.id}
  GROUP BY 1
  ORDER BY 3 desc`;

  const tournament_res = await sql`
  SELECT 
  tournaments.date || ': ' || tournaments.tournament_name as Tournament, 
  team_games.tournament_id,
  sets.year as Year,
  tournaments.tournament_name,
  date as Date,
  teams.team as Team,
  players as Players,
  cast(rank as int) || '/' || cast(num_teams as int) as Finish,
  count(result) as GP,
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
  sum(bonus_pts)/sum(bonuses_heard)::numeric as PPB,
  max(a_value) as \"A-Value\" 
  from team_games
  LEFT JOIN schools on team_games.school_id = schools.school_id
  LEFT JOIN teams on team_games.team_id = teams.team_id
  LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
  LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
  and team_games.team_id = tournament_results.team_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN (SELECT tournament_id, team_id, 
  string_agg(distinct ' ' || coalesce(fname|| ' ' || lname, player_games.player), ', ') as players
   from player_games
   LEFT JOIN schools on player_games.school_id = schools.school_id
   LEFT JOIN players on player_games.player_id = players.player_id
   LEFT JOIN people on players.person_id = people.person_id
   WHERE schools.slug = ${params.id}
   GROUP BY 1, 2) player_games
  on team_games.tournament_id = player_games.tournament_id
  and team_games.team_id = player_games.team_id
  WHERE schools.slug = ${params.id}
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8
  ORDER BY date desc`;

  const player_res = await sql`
  SELECT 
     fname || ' ' || lname as Player, 
     schools.slug, 
     people.slug as person_slug,
     DATE_PART('year', min(date::date)) || '-' || DATE_PART('year', max(date::date))  as Yrs,
     count(distinct player_games.tournament_id) as Tmnts,
     count(tens) as GP,
     sum(coalesce(tuh, 20)) as TUH,
     sum(coalesce(powers, 0)) as \"15\", 
     sum(tens) as \"10\", 
     sum(negs) as \"-5\",
     sum(coalesce(powers, 0))/count(tens)::numeric as \"15/G\",
     sum(tens)/count(tens)::numeric as \"10/G\",
     sum(negs)/count(tens)::numeric as \"-5/G\",
     (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
     avg(pts) as PPG from 
     player_games
     LEFT JOIN schools on player_games.school_id = schools.school_id
     LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
     INNER JOIN players on player_games.player_id = players.player_id
     LEFT JOIN people on players.person_id = people.person_id
     WHERE schools.slug = ${params.id}
     GROUP BY 1, 2, 3`;

  const hosting_res = await sql`
  SELECT 
     tournaments.tournament_id,
     sets.year as Year,
     date as Date,
     \"set\" as \"Set\",
     count(distinct teams.team) as Teams
     from team_games
     LEFT JOIN teams on team_games.team_id = teams.team_id
     LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
     LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
     and team_games.team_id = tournament_results.team_id
     LEFT JOIN sets on tournaments.set_id = sets.set_id
     LEFT JOIN sites on tournaments.site_id = sites.site_id
     LEFT JOIN schools on sites.school_id = schools.school_id
     WHERE schools.slug = ${params.id}
     GROUP BY 1, 2, 3, 4
     ORDER BY date desc`;

  return {
    props: {
      result: {
        Summary: summary_res,
        'Teams': teams_res,
        'Players': player_res,
        'Tournaments': tournament_res,
        'Hosting': hosting_res
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <School result={pageData} />;
}
