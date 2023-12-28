import Game from "./game-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  return [];
}


export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  const data = pageData.props.result
  return {
    title: `${data.Summary[0]["team"]} vs. ${data.Summary[1]["team"]} | College Quizbowl Stats`,
  };
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
  const buzzes = await sql`
  SELECT
  buzzpoints_tournament.slug,
  buzzpoints_round.number as round_number,
  buzzpoints_packet_question.question_number,
  buzzpoints_tossup.answer_primary,
  coalesce(people.player, buzzpoints_player.name) as player,
  buzzpoints_buzz.buzz_position,
  buzzpoints_buzz.value
  FROM buzzpoints_buzz
  LEFT JOIN buzzpoints_player on buzzpoints_buzz.player_id = buzzpoints_player.id
  LEFT JOIN buzzpoints_player_lookup on buzzpoints_player_lookup.id = buzzpoints_player.id
  LEFT JOIN people on buzzpoints_player_lookup.person_id = people.person_id
  LEFT JOIN buzzpoints_game_lookup on buzzpoints_buzz.game_id = buzzpoints_game_lookup.id
  LEFT JOIN buzzpoints_game ON buzzpoints_buzz.game_id = buzzpoints_game.id
  LEFT JOIN buzzpoints_round ON buzzpoints_game.round_id = buzzpoints_round.id
  LEFT JOIN buzzpoints_tournament ON buzzpoints_round.tournament_id = buzzpoints_tournament.id
  LEFT JOIN buzzpoints_tournament_lookup ON buzzpoints_tournament_lookup.cqs_tournament_id = buzzpoints_tournament.id
  LEFT JOIN buzzpoints_tossup on buzzpoints_buzz.tossup_id = buzzpoints_tossup.id
  LEFT JOIN buzzpoints_question ON buzzpoints_tossup.question_id = buzzpoints_question.id
  LEFT JOIN buzzpoints_packet_question ON buzzpoints_question.id = buzzpoints_packet_question.question_id
  LEFT JOIN buzzpoints_packet ON buzzpoints_packet_question.packet_id = buzzpoints_packet.id
  WHERE cqs_game_id = ${params.id}
  `

  const bonuses = await sql`
  
  `

  return {
    props: {
      result: {
        Summary: summary,
        Players: players,
        Teams: teams,
        Buzzes: buzzes,
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
