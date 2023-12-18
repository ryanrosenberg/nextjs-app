import Game from "./game-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  return [];
}

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const summary = await sql`
    SELECT 
    team_games.round, 
    teams.team, 
    tournaments.tournament_name, 
    tournaments.tournament_id
    from team_games 
    LEFT JOIN games on team_games.game_id = games.game_id
    LEFT JOIN tournaments on team_games.tournament_id = tournaments.tournament_id
    LEFT JOIN teams on team_games.team_id = teams.team_id
    LEFT JOIN sets on tournaments.set_id = sets.set_id
    LEFT JOIN sites on tournaments.site_id = sites.site_id
    WHERE team_games.game_id = ${params.id}
      `;
  const players = await sql`SELECT
  tournament_id,
game_id,
team, 
coalesce(fname|| ' ' || lname, player_games.player) as Player,
coalesce(tuh, 20) as TUH,
powers as \"15\", 
tens as \"10\", 
negs as \"-5\", 
pts as Pts
from player_games
LEFT JOIN teams on player_games.team_id = teams.team_id
LEFT JOIN players on player_games.player_id = players.player_id
LEFT JOIN people on players.person_id = people.person_id
      WHERE game_id = ${params.id}
        `;
  const teams = await sql`
  SELECT
  game_id,
  team,
  round, total_pts, bonus_pts, bonuses_heard, opp_pts
  from team_games
  LEFT JOIN teams on team_games.team_id = teams.team_id
  where game_id = ${params.id}
          `;

  return {
    props: {
      result: {
        Summary: summary,
        Players: players,
        Teams: teams,
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Game result={pageData} />;
}
