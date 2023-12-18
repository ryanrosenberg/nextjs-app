import Season from "./season-page";
import { neon } from '@neondatabase/serverless';

export async function generateStaticParams() {
  const sql = neon(process.env.DATABASE_URL);
  const data = await sql`
  SELECT distinct sets.year from sets
    `;

  return data;
}

export async function generateMetadata({ params }) {
  return {
    title: `20${params.id} | College Quizbowl Stats`,
  };
}

async function getData(params) {
  const docRef = doc(db, "seasons", params.id);
  const docSnap = await getDoc(docRef);
export async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  const champs_res = await sql`SELECT 
  sets.year as Season, 
  tournament as Tournament, 
  champions.tournament_id, 
  \"set\", 
  site, 
  team, 
  players
  from champions
  LEFT JOIN tournaments on champions.tournament_id = tournaments.tournament_id
  LEFT JOIN sets on tournaments.set_id = sets.set_id
  LEFT JOIN sites on tournaments.site_id = sites.site_id
  LEFT JOIN (SELECT player_games.tournament_id, team_id, 
             string_agg(distinct ' ' || coalesce(fname|| ' ' || lname, player_games.player), ', ') as players
              from player_games
              LEFT JOIN schools on player_games.school_id = schools.school_id
              LEFT JOIN players on player_games.player_id = players.player_id
              LEFT JOIN people on players.person_id = people.person_id
              LEFT JOIN tournaments on player_games.tournament_id = tournaments.tournament_id
              LEFT JOIN sets on tournaments.set_id = sets.set_id
              WHERE year = ${params.id}
              GROUP BY 1, 2) player_games
             on champions.tournament_id = player_games.tournament_id
             and champions.team_id = player_games.team_id
  where champions.year = ${params.id}`;

  const tournament_res = await sql`
  SELECT tournaments.*, 
  results.Champion 
  FROM (SELECT 
    date as Date,
    sets.year, \"set\" as \"Set\", site as Site,
    \"set\" || ' at ' || site as Tournament, 
    tournaments.tournament_id,
    count(distinct team_games.team_id) as Teams,
    count(distinct team_games.school_id) as Schools
    from team_games
    left join teams on team_games.team_id = teams.team_id
    left join tournaments on team_games.tournament_id = tournaments.tournament_id
    LEFT JOIN sets on tournaments.set_id = sets.set_id
    LEFT JOIN sites on tournaments.site_id = sites.site_id
    WHERE sets.year = ${params.id}
    GROUP BY 1, 2, 3, 4, 5, 6
    ORDER BY Date) tournaments
    LEFT JOIN
    (
        SELECT 
    distinct tournaments.tournament_id,
    date as Date,
    \"set\" || ' at ' || site as Tournament,
    teams.team as Champion
        from team_games
        left join teams on team_games.team_id = teams.team_id
        left join tournaments on team_games.tournament_id = tournaments.tournament_id
        LEFT JOIN sets on tournaments.set_id = sets.set_id
        LEFT JOIN sites on tournaments.site_id = sites.site_id
        LEFT JOIN tournament_results on team_games.tournament_id = tournament_results.tournament_id
        and team_games.team_id = tournament_results.team_id
        WHERE sets.year = ${params.id}
        and rank = 1
        ORDER BY Date desc
    ) results
    on tournaments.tournament_id = results.tournament_id`;

  const sets_res = await sql`SELECT 
  sets.\"set\" as \"Set\", set_slug, difficulty, 
  case difficulty when 'easy' then 1 when 'medium' then 2 when 'regionals' then 3 when 'nationals' then 4 end as diffnum,
                      count(distinct team_games.site_id) as Sites,
                      count(distinct team_games.team_id) as Teams,
                      count(distinct team_games.school_id) as Schools
  from team_games
   LEFT JOIN sets on team_games.set_id = sets.set_id
   LEFT JOIN sites on team_games.site_id = sites.site_id
  left join editors on sets.set_id = editors.set_id
   LEFT JOIN schools on team_games.school_id = schools.school_id
   LEFT JOIN teams on team_games.team_id = teams.team_id
   WHERE sets.year = ${params.id}
   GROUP BY 1,2,3, 4
   order by diffnum, Teams`;

  return {
    props: {
      result: {
        Champions: champs_res,
        Tournaments: tournament_res,
        Sets: sets_res,
      },
    },
  };
}
export default async function Page({ params }) {
  const pageData = await getData(params);

  return <Season result={pageData} />;
}
