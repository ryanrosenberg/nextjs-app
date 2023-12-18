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
    // title: `${pageData.props.result.Summary[0]["tournament_name"]} Team Detail | College Quizbowl Stats`,
    title: `${pageData.props.result.Summary[0]["tournament_name"]} Team Detail | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const summary_res = await sql`
  SELECT 
           date, tournaments.tournament_name, naqt_id
           from tournaments 
           LEFT JOIN sets on tournaments.set_id::varchar = sets.set_id::varchar
           LEFT JOIN sites on tournaments.site_id::varchar = sites.site_id::varchar
           WHERE tournaments.tournament_id::varchar = ${params.id}
           `;

  const players_res = await sql`
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
  const player_detail_res = await sql`
  SELECT
  coalesce(fname|| ' ' || lname, player_games.player) as player, team,
  CAST(REPLACE(games.round, 'Round ', '') as int) as Round,
  opponent_team as Opponent,
  player_games.game_num, player_games.game_id,
  case result when 1 then 'W' when 0 then 'L' else 'T' end as Result,
  coalesce(player_games.tuh, 20) as TUH,
  player_games.powers as \"15\", player_games.tens as \"10\", player_games.negs as \"-5\", pts as Pts
  from player_games
  LEFT JOIN team_games on player_games.game_id::varchar = team_games.game_id::varchar
  and player_games.team_id::varchar = team_games.team_id::varchar
  LEFT JOIN (select team_id, team as opponent_team from teams) a on team_games.opponent_id::varchar = a.team_id::varchar
  LEFT JOIN players on player_games.player_id::varchar = players.player_id::varchar
  LEFT JOIN people on players.person_id::varchar = people.person_id::varchar
  LEFT JOIN teams on player_games.team_id::varchar = teams.team_id::varchar
  left join games on player_games.game_id::varchar = games.game_id::varchar
  WHERE player_games.tournament_id::varchar = ${params.id}
             order by team, player, Round
          `;
  const all = {
    Summary: summary_res,
    Players: players_res,
    "Player Detail": player_detail_res,
  };
  return {
    props: {
      result: all,
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Tournament result={pageData} />;
}
