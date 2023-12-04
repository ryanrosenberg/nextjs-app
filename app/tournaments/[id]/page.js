import Tournament from "./tournament-page";
import { db as dbi } from "@vercel/postgres";
import { db } from "../../../lib/firestore";
import { collection, getDocs } from "firebase/firestore";

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "tournaments"));
  var paths = [];
  querySnapshot.forEach((doc) => {
    paths.push({ id: doc.id });
  });

  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]["tournament_name"]} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const client = await dbi.connect();
  const summary_res = await client.sql`
  SELECT 
           date, tournaments.tournament_name, naqt_id
           from tournaments 
           LEFT JOIN sets on tournaments.set_id::varchar = sets.set_id::varchar
           LEFT JOIN sites on tournaments.site_id::varchar = sites.site_id::varchar
           WHERE tournaments.tournament_id::varchar = ${params.id}
           `;

  const standings_res = await client.sql`
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
          `;

  const players_res = await client.sql`
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
       sum(powers)/count(tens) as \"15/G\",
       sum(tens)/count(tens) as \"10/G\",
       sum(negs)/count(tens) as \"-5/G\",
       sum(powers)/NULLIF(sum(negs), 0) as \"P/N\",
       (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(sum(negs), 0) as \"G/N\",
       (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20)) as \"TU%\",
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

  const team_detail_team_res = await client.sql`
  SELECT
  CAST(REPLACE(round, 'Round ', '') as int) as Round,
  team as Team,
  game_num, game_id,
  opponent as Opponent,
  case result when 1 then 'W' when 0 then 'L' else 'T' end as Result,
  total_pts as PF, opp_pts as PA, powers as \"15\", tens as \"10\",
  negs as \"-5\", coalesce(tuh, 20) as TUH,
  total_pts/coalesce(tuh, 20) as PPTUH, 
  bonuses_heard as BHrd, bonus_pts as BPts,
  bonus_pts/NULLIF(bonuses_heard, 0) as PPB
  from team_games
  LEFT JOIN teams on team_games.team_id::varchar = teams.team_id::varchar
  LEFT JOIN (select team_id, team as opponent_team from teams) a on team_games.opponent_id::varchar = a.team_id::varchar
  where team_games.tournament_id::varchar = ${params.id}
  order by Team, Round
          `;

  const team_detail_player_res = await client.sql`
  SELECT 
  coalesce(fname|| ' ' || lname, player_games.player) as Player, 
  team as Team,
  count(tens) as GP,
  sum(coalesce(tuh, 20)) as TUH,
  sum(powers) as \"15\", sum(tens) as \"10\", sum(negs) as \"-5\",
  sum(powers)/count(tens) as \"15/G\",
  sum(tens)/count(tens) as \"10/G\",
  sum(negs)/count(tens) as \"-5/G\",
  sum(powers)/NULLIF(sum(negs), 0) as \"P/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/NULLIF(sum(negs), 0) as \"G/N\",
  (sum(coalesce(powers, 0)) + sum(tens))/sum(coalesce(tuh, 20)) as \"TU%\",
  sum(pts) as Pts,
  avg(pts) as PPG from 
  player_games
  LEFT JOIN teams on player_games.team_id::varchar = teams.team_id::varchar
  LEFT JOIN tournaments on player_games.tournament_id::varchar = tournaments.tournament_id::varchar
  LEFT JOIN players on player_games.player_id::varchar = players.player_id::varchar
  LEFT JOIN people on players.person_id::varchar = people.person_id::varchar
  where player_games.tournament_id::varchar = ${params.id}
  GROUP BY 1, 2
  order by Team, Player
          `;

  const player_detail_res = await client.sql`
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
    Summary: summary_res.rows,
    Standings: standings_res.rows,
    Players: players_res.rows,
    // "Team Detail Teams": team_detail_team_res.rows,
    // "Team Detail Players": team_detail_player_res.rows,
    // "Player Detail": player_detail_res.rows,
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
