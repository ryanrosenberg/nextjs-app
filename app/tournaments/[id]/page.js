import Tournament from "./tournament-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  const sql = neon(process.env.DATABASE_URL);
  const tournaments = await sql`
  SELECT distinct tournament_id
           from tournaments 
           `;
  return tournaments;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]["tournament_name"]} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const summary_res = sql`
  SELECT 
           date, 
           tournaments.tournament_id,
           tournaments.tournament_name,
           naqt_id
           from tournaments 
           LEFT JOIN sets on tournaments.set_id::varchar = sets.set_id::varchar
           LEFT JOIN sites on tournaments.site_id::varchar = sites.site_id::varchar
           WHERE tournaments.tournament_id::varchar = ${params.id}
           `;

  const standings_res = sql`
  SELECT 
  rank as Rank,
  teams.team as Team,
  schools.school_name as School, slug, bracket,
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
  avg(total_pts) as PPG, 
  sum(bonus_pts)/sum(bonuses_heard)::numeric as PPB,
  max(a_value) as \"A-Value\" 
  from team_games
  LEFT JOIN teams on team_games.team_id::varchar = teams.team_id::varchar
  LEFT JOIN schools on teams.school_id::varchar = schools.school_id::varchar
  LEFT JOIN tournaments on team_games.tournament_id::varchar = tournaments.tournament_id::varchar
  LEFT JOIN tournament_results on team_games.tournament_id::varchar = tournament_results.tournament_id::varchar
  and team_games.team_id::varchar= tournament_results.team_id::varchar
  LEFT JOIN sets on tournaments.set_id::varchar = sets.set_id::varchar
  LEFT JOIN sites on tournaments.site_id::varchar = sites.site_id::varchar
  WHERE team_games.tournament_id::varchar = ${params.id}
  GROUP BY 1, 2, 3, 4, 5
  ORDER BY Rank
          `;

  const players_res = sql`
  SELECT *, rawPPG as PPG from (
    SELECT
       coalesce(fname|| ' ' || lname, player_games.player) as Player,
       coalesce(fname|| ' ' || lname, player_games.player) as raw_player,
       slug,
       team as Team,
       count(tens) as GP,
       sum(coalesce(tuh, 20)) as TUH,
       sum(powers) as \"15\", 
       sum(tens) as \"10\", 
       sum(negs) as \"-5\",
       sum(powers)/count(tens)::numeric as \"15/G\",
       sum(tens)/count(tens)::numeric as \"10/G\",
       sum(negs)/count(tens)::numeric as \"-5/G\",
       sum(powers)/NULLIF(sum(negs), 0)::numeric as \"P/N\",
       (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(sum(negs), 0)::numeric as \"G/N\",
       (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
       avg(pts) as rawPPG from
       player_games
       LEFT JOIN teams on player_games.team_id::varchar = teams.team_id::varchar
       LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
       LEFT JOIN sets on tournaments.set_id::varchar = sets.set_id::varchar
       LEFT JOIN sites on tournaments.site_id::varchar = sites.site_id::varchar
       LEFT JOIN players on player_games.player_id::varchar = players.player_id::varchar
       LEFT JOIN people on players.person_id::varchar = people.person_id::varchar
       WHERE player_games.tournament_id::varchar = ${params.id}
       GROUP BY 1, 2, 3, 4
       ORDER BY rawPPG desc) e
          `;

  const all = await Promise.all([
    summary_res, standings_res, players_res
  ])

  return {
    props: {
      result: {
        Summary: all[0],
        Standings: all[1],
        Players: all[2],
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Tournament result={pageData} />;
}
