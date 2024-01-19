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

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);

  const summary_res = await sql`
  SELECT 
           date, tournaments.tournament_name, naqt_id
           from tournaments 
           LEFT JOIN sets on tournaments.set_id = sets.set_id
           LEFT JOIN sites on tournaments.site_id = sites.site_id
           WHERE tournaments.tournament_id = ${params.id}
           `;
  const team_detail_team_res = await sql`
  SELECT
  REPLACE(round, 'Round ', '')::numeric as Round,
  team as Team,
  game_num, game_id,
  opponent as Opponent,
  case result when 1 then 'W' when 0 then 'L' else 'T' end as Result,
  total_pts as PF, opp_pts as PA, powers as \"15\", tens as \"10\",
  negs as \"-5\", coalesce(tuh, 20) as TUH,
  total_pts/coalesce(tuh, 20)::numeric as PPTUH, 
  bonuses_heard as BHrd, bonus_pts as BPts,
  bonus_pts/NULLIF(bonuses_heard, 0)::numeric as PPB
  from team_games
  LEFT JOIN teams on team_games.team_id = teams.team_id
  LEFT JOIN (select team_id, team as opponent_team from teams) a on team_games.opponent_id = a.team_id
  where team_games.tournament_id = ${params.id}
  order by Team, Round
          `;

  const team_detail_player_res = await sql`
  SELECT 
  coalesce(fname|| ' ' || lname, player_games.player) as Player, 
  team as Team,
  count(tens) as GP,
  sum(coalesce(tuh, 20)) as TUH,
  sum(powers) as \"15\", sum(tens) as \"10\", sum(negs) as \"-5\",
  sum(powers)/count(tens)::numeric as \"15/G\",
  sum(tens)/count(tens)::numeric as \"10/G\",
  sum(negs)/count(tens)::numeric as \"-5/G\",
  sum(powers)/NULLIF(sum(negs), 0)::numeric as \"P/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(sum(negs), 0)::numeric as \"G/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\",
  sum(pts) as Pts,
  avg(pts) as PPG from 
  player_games
  LEFT JOIN teams on player_games.team_id = teams.team_id
  LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  where player_games.tournament_id = ${params.id}
  GROUP BY 1, 2
  order by Team, Player
          `;

  const all = {
    Summary: summary_res,
    "Team Detail Teams": team_detail_team_res,
    "Team Detail Players": team_detail_player_res,
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
