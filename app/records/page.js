import Records from "./records-page";
import { db as dbi } from "@vercel/postgres";

export async function getData() {
  const client = await dbi.connect();
  const summary1 = client.sql`
  SELECT 
  school_name as \"School\", 
  slug,
  count(distinct tournament_id) as Tournaments,
  sum(case result when 1 then 1 else 0 end) as Wins
  from team_games
  left join schools on team_games.school_id = schools.school_id
  left join sets on team_games.set_id = sets.set_id
  where team_games.school_id is not null
  and school_name is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2
  ORDER BY Wins desc
  LIMIT 10`;
  const summary2 = client.sql`
  SELECT 
  a.*
  FROM (SELECT team as \"Team\", 
count(distinct tournament_id) as Tournaments,
avg(result) as \"Win%\"
from team_games
left join schools on team_games.school_id = schools.school_id
left join teams on team_games.team_id = teams.team_id
left join sets on team_games.set_id = sets.set_id
where schools.open is null and schools.high_school is null
and team_games.school_id is not null
and sets.difficulty <> 'easy'
GROUP BY 1) a
WHERE Tournaments >= 10
ORDER BY 3 desc
LIMIT 10`;
  const summary3 = client.sql`SELECT 
  school_name as \"School\", 
  slug,
  count(distinct tournament_results.tournament_id) as Tournaments,
  sum(case rank when 1 then 1 else 0 end) as Wins
  from tournament_results
  left join teams on tournament_results.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  left join tournaments on tournament_results.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  where teams.school_id is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2
  ORDER BY 3 desc
  LIMIT 10`;
  const summary4 = client.sql`
  SELECT champions.*, 
  schools.slug 
  from champions
  left join teams on champions.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id`;

  const summary5 = client.sql`SELECT year as Season, team as \"Team\", 
count(distinct tournament_id) as Tournaments,
sum(case result when 1 then 1 else 0 end) as Wins
from team_games
left join teams on team_games.team_id = teams.team_id
left join schools on teams.school_id = schools.school_id
left join sets on team_games.set_id = sets.set_id
where teams.school_id is not null
and sets.difficulty <> 'easy'
GROUP BY 1, 2
ORDER BY 4 desc
LIMIT 10`;
  const summary6 = client.sql`SELECT sets.year as Season, team as \"Team\", 
  count(distinct tournament_results.tournament_id) as Tournaments,
  sum(case rank when 1 then 1 else 0 end) as Wins
  from tournament_results
  left join teams on tournament_results.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  left join tournaments on tournament_results.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  where teams.school_id is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2
  ORDER BY 4 desc
  LIMIT 10`;
  const summary7 = client.sql`SELECT *
  FROM (
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  round(sum(total_pts)*20/sum(coalesce(tuh, 20)), 2) as PP20TUH
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and \"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10) a`;
  const summary8 = client.sql`
  SELECT 
  *
  FROM (
  SELECT sets.year as Season,
  \"set\" as Tournament, \"set\", site, team as \"Team\", team_games.tournament_id,
  (sum(coalesce(powers, 0))+sum(tens))/nullif(sum(coalesce(tuh, 20)), 0) as \"TU%\"
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and \"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10) a`;
  const summary9 = client.sql`
  SELECT sets.year as Season, team_games.tournament_id,
  \"set\" as Tournament, \"set\", site, team as \"Team\", 
  round((sum(bonus_pts)/nullif(sum(bonuses_heard), 0)), 2) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.\"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6`;
  const summary10 = client.sql`
  SELECT *
  FROM (
  SELECT sets.year as Season,
  \"set\" as Tournament, \"set\", site, team as \"Team\", team_games.tournament_id,
  round(sum(total_pts)*20/sum(coalesce(tuh, 20)), 2) as PP20TUH
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10) a`;
console.log(1);
  const summary11 = client.sql`SELECT 
  *
  FROM (
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  (sum(coalesce(powers, 0))+sum(tens))/sum(coalesce(tuh, 20)) as \"TU%\"
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10) a`;
  const summary12 = client.sql`SELECT 
  sets.year as Season, 
  team_games.tournament_id,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  round((sum(bonus_pts)/nullif(sum(bonuses_heard), 0)), 2) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6`;
  const summary13 = client.sql`SELECT 
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  game_id, 
  coalesce(tuh, 20) as TUH,
  total_pts as Pts
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  ORDER BY total_pts desc
  LIMIT 10`;
  const summary14 = client.sql`
  SELECT 
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", site, 
  team as \"Team\", 
  team_games.tournament_id,
  game_id, 
  coalesce(tuh, 20) as TUH,
  total_pts as Pts,
  round(total_pts*20/coalesce(tuh, 20), 2) as PP20TUH
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  and coalesce(tuh, 20) > 12
  ORDER BY PP20TUH desc
  LIMIT 10`;
  const summary15 = client.sql`
  SELECT
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team_games.tournament_id, 
  game_id, 
  string_agg(team, ' vs. ') as Teams, 
  string_agg(total_pts::text, ' - ') as Score, 
  coalesce(avg(tuh), 20) as TUH,
  sum(total_pts) as Pts
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY Pts desc
  LIMIT 10`;
  const summary16 = client.sql`
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", site,
  game_id, 
  team_games.tournament_id,
  string_agg(team, ' vs. ') as Teams, 
  string_agg(cast(total_pts as text), ' - ') as Score, 
  sum(total_pts) as Pts,
  coalesce(avg(tuh), 20) as TUH,
  round(sum(total_pts)*20/coalesce(avg(tuh), 20), 2) as PP20TUH
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  and coalesce(tuh, 20) > 12
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY PP20TUH desc
  LIMIT 10`;
  const summary17 = client.sql`
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site,
  game_id, 
  team as Team,
  team_games.tournament_id,
  case result when 1 then 'W' when 0 then 'L' else 'T' end as Result,
  coalesce(tuh, 20) as TUH,
  powers as \"15\", 
  tens as \"10\", 
  negs as \"-5\",
  total_pts as Pts
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  and coalesce(powers, 0) + tens + negs <= coalesce(tuh, 20)
  ORDER BY negs desc
  LIMIT 10`;
  const summary18 = client.sql`
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site,
  game_id, 
  team_games.tournament_id,
  team as Team, 
  opponent as Opponent,
  coalesce(tuh, 20) as TUH,
  powers as \"15\", 
  tens as \"10\", 
  negs as \"-5\",
  total_pts as Pts
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  and coalesce(powers, 0) + tens = coalesce(tuh, 20)
  and negs = 0
  and coalesce(tuh, 20) > 12
  ORDER BY Pts desc`;
  const summary19 = client.sql`
  SELECT *
  from (
  SELECT fname || ' ' || lname as Player, slug,
  count(distinct tournament_id) as Ts,
  count(tournament_id) as GP,
  sum(pts) as Pts
  from player_games
  left join teams on player_games.team_id = teams.team_id
  left join sets on player_games.set_id = sets.set_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  where teams.school_id is not null
  and sets.difficulty <> 'easy'
  and fname is not null
  GROUP BY 1, 2
  ORDER BY Pts desc
  LIMIT 10) a`;
  const summary20 = client.sql`
  SELECT fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
  count(distinct tournament_id) as Ts
  from player_games
  left join teams on player_games.team_id = teams.team_id
  left join sets on player_games.set_id = sets.set_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  where teams.school_id is not null
  and sets.difficulty <> 'easy'
  and fname is not null
  GROUP BY 1, 2
  ORDER BY Ts desc
  LIMIT 10`;
  const summary21 = client.sql`
  SELECT fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
count(distinct tournament_id) as Ts
from player_games
left join teams on player_games.team_id = teams.team_id
left join sets on player_games.set_id = sets.set_id
LEFT JOIN players on player_games.player_id = players.player_id
LEFT JOIN people on players.person_id = people.person_id
where teams.school_id is not null
and sets.difficulty <> 'easy'
and fname is not null
and sets.\"set\" in ('DI ICT', 'ACF Nationals')
GROUP BY 1, 2
ORDER BY Ts desc
LIMIT 10`;
  const summary22 = client.sql`
  SELECT 
  fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
  sum(case when rank = 1 then 1 else 0 end) as Wins
  from (select distinct player_id, tournament_id, set_id, team_id from player_games) player_games
  left join tournament_results on player_games.team_id = tournament_results.team_id 
  and player_games.tournament_id = tournament_results.tournament_id
  left join teams on player_games.team_id = teams.team_id
  left join sets on player_games.set_id = sets.set_id
  LEFT JOIN players on player_games.player_id = players.player_id
  LEFT JOIN people on players.person_id = people.person_id
  where teams.school_id is not null
  and sets.difficulty <> 'easy'
  and fname is not null
  GROUP BY 1, 2
  ORDER BY Wins desc
  LIMIT 10`;
  const summary23 = client.sql`
  select * from (
    SELECT fname || ' ' || lname as Player, 
    slug,
    replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
    count(player_games.game_id) as GP,
    avg(result) as \"Win%\"
    from player_games
    left join (select game_id, team_id, result from team_games) results on player_games.team_id = results.team_id and player_games.game_id = results.game_id
    left join teams on player_games.team_id = teams.team_id
    left join sets on player_games.set_id = sets.set_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    GROUP BY 1, 2
    ORDER BY 5 desc) a
    where GP >= 50
    LIMIT 10`;
  const summary24 = client.sql`
  SELECT 
  sets.year as Season, 
  school as School,
  fname || ' ' || lname as Player, 
  people.slug as player_slug, 
  schools.slug as school_slug,
count(distinct tournament_id) as Ts,
count(tournament_id) as GP,
sum(pts) as Pts
from player_games
left join teams on player_games.team_id = teams.team_id
left join schools on teams.school_id = schools.school_id
left join sets on player_games.set_id = sets.set_id
LEFT JOIN players on player_games.player_id = players.player_id
LEFT JOIN people on players.person_id = people.person_id
where teams.school_id is not null
and sets.difficulty <> 'easy'
and fname is not null
GROUP BY 1, 2, 3, 4, 5
ORDER BY Pts desc
LIMIT 10`;
  const summary25 = client.sql`
  Select * from (
    SELECT sets.year as Season, 
            school as School,
            fname || ' ' || lname as Player, 
            people.slug as player_slug, 
            schools.slug as school_slug,
    count(distinct tournament_id) as Ts,
    count(tournament_id) as GP,
    sum(pts) as Pts,
    round(sum(pts)*20/nullif(sum(coalesce(tuh, 20)), 0), 2) as PP20TUH
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join schools on teams.school_id = schools.school_id
    left join sets on player_games.set_id = sets.set_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    GROUP BY 1, 2, 3, 4, 5
    ORDER BY PP20TUH desc) a
    where Ts >= 5
    LIMIT 10`;
  const summary26 = client.sql` 
  Select * from (
    SELECT sets.year as Season,
    fname || ' ' || lname as Player,
    people.slug as player_slug, 
    schools.slug as school_slug,
school as School,
count(distinct tournament_id) as Ts,
count(player_games.game_id) as GP,
round(avg(result), 3) as \"Win%\"
from player_games
left join (select game_id, team_id, result from team_games) results on player_games.team_id = results.team_id and player_games.game_id = results.game_id
left join teams on player_games.team_id = teams.team_id
left join schools on teams.school_id = schools.school_id
left join sets on player_games.set_id = sets.set_id
LEFT JOIN players on player_games.player_id = players.player_id
LEFT JOIN people on players.person_id = people.person_id
where teams.school_id is not null
and sets.difficulty <> 'easy'
and fname is not null
GROUP BY 1, 2, 3, 4, 5
ORDER BY \"Win%\" desc) a
where Ts >= 5
LIMIT 10`;
  const summary27 = client.sql`
  Select 
  a.*,
  a.rawPP20TUH as PP20TUH from 
  (SELECT 
    sets.year as Season, 
    \"set\" as Tournament, 
    \"set\", 
    site, 
    player_games.tournament_id,
    team as Team, 
    fname || ' ' || lname as Player, 
    people.slug as player_slug, 
    schools.slug as school_slug,
    count(game_id) as GP,
    sum(pts) as Pts,
    round(sum(pts)*20/nullif(sum(coalesce(tuh, 20)), 0), 2) as rawPP20TUH
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join schools on teams.school_id = schools.school_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9
    ORDER BY rawPP20TUH desc) a
    LIMIT 10`;
  const summary28 = client.sql`
  Select 
  a.*, 
  a.rawPP20TUH as PP20TUH from 
  (SELECT 
    sets.year as Season, 
    \"set\" as Tournament, 
    \"set\", 
    site, 
    player_games.tournament_id,
    team as Team, 
    fname || ' ' || lname as Player, 
    people.slug as player_slug, 
    schools.slug as school_slug,
    count(game_id) as GP,
    sum(pts) as Pts,
    round(sum(pts)*20/nullif(sum(coalesce(tuh, 20)), 0), 2) as rawPP20TUH
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join schools on teams.school_id = schools.school_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.\"set\" in ('DI ICT', 'ACF Nationals')
    and fname is not null
    GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9
    ORDER BY rawPP20TUH desc) a
    LIMIT 10`;
  const summary29 = client.sql`
  Select a.* from (SELECT sets.year as Season, 
    \"set\" as Tournament, \"set\", site, player_games.tournament_id,
    team as Team, fname || ' ' || lname as Player, people.slug as player_slug, schools.slug as school_slug,
    count(game_id) as GP,
    sum(negs) as \"-5\",
    round(sum(negs)*20/nullif(sum(coalesce(tuh, 20)), 0), 2) as \"-5P20TUH\"
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join schools on teams.school_id = schools.school_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9
    ORDER BY \"-5P20TUH\" desc) a
    where GP >= 5
    LIMIT 10`;
  const summary30 = client.sql`
  Select a.* from (
    SELECT sets.year as Season,
    \"set\" as Tournament, 
    \"set\",
    site, 
    team as Team, 
    fname || ' ' || lname as Player, 
    people.slug as player_slug,
    game_id, 
    player_games.tournament_id,
    coalesce(tuh, 20) as TUH,
    powers as \"15\", 
    tens as \"10\", 
    negs as \"-5\",
    pts as Pts
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    ORDER BY Pts desc) a
    LIMIT 10`;
  const summary31 = client.sql`Select a.* from (SELECT sets.year as Season,
    \"set\" as Tournament, \"set\", site, 
            team as Team, fname || ' ' || lname as Player, people.slug as player_slug,
            game_id,player_games.tournament_id,
    coalesce(tuh, 20) as TUH,
    powers as \"15\", tens as \"10\", negs as \"-5\",
    pts as Pts
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    and sets.\"set\" in ('DI ICT', 'ACF Nationals')
    ORDER BY Pts desc) a
    LIMIT 10`;
  const summary32 = client.sql`Select a.* from (SELECT sets.year as Season,
    \"set\" as Tournament, \"set\", site, 
            team as Team, fname || ' ' || lname as Player, people.slug as player_slug,
            game_id,player_games.tournament_id,
    coalesce(tuh, 20) as TUH,
    powers as \"15\", tens as \"10\", negs as \"-5\",
    coalesce(powers, 0) + tens as Tossups
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    ORDER BY Tossups desc) a
    LIMIT 10`;
  const summary33 = client.sql`Select a.* from (SELECT sets.year as Season,
    \"set\" as Tournament, \"set\", site, 
            team as Team, fname || ' ' || lname as Player, people.slug as player_slug,
            game_id,player_games.tournament_id,
    coalesce(tuh, 20) as TUH,
    powers as \"15\", tens as \"10\", negs as \"-5\"
    from player_games
    left join teams on player_games.team_id = teams.team_id
    left join tournaments on player_games.tournament_id = tournaments.tournament_id
    left join sets on player_games.set_id = sets.set_id
    left join sites on player_games.site_id = sites.site_id
    LEFT JOIN players on player_games.player_id = players.player_id
    LEFT JOIN people on players.person_id = people.person_id
    where teams.school_id is not null
    and sets.difficulty <> 'easy'
    and fname is not null
    ORDER BY negs desc) a
    LIMIT 10`;
  const summary34 = client.sql`SELECT school as School, slug,
  count(distinct tournaments.tournament_id) as Tournaments
  from tournaments
  left join sites on tournaments.site_id = sites.site_id
  left join schools on sites.school = schools.school_name
  where school is not null
  GROUP BY 1, 2
  ORDER BY 3 desc
  LIMIT 10`;
  const summary35 = client.sql`SELECT 
  tournaments.tournament_id,
  sets.year as Year, \"set\" as \"Tournament\",
  site as Host, school, slug,
count(distinct team_id) as Teams
from team_games
left join sets on team_games.set_id = sets.set_id
left join tournaments on team_games.tournament_id = tournaments.tournament_id
left join sites on tournaments.site_id = sites.site_id
left join schools on sites.school = schools.school_name
where school is not null
and \"set\" not in ('DI ICT', 'ACF Nationals')
GROUP BY 1
ORDER BY Teams desc
LIMIT 10`;
  const summary36 = client.sql``;
  const summary37 = client.sql``;

  const all = await Promise.all([
    summary1,
    summary2,
    summary3,
    summary4,
    summary5,
    summary6,
    summary7,
    summary8,
    summary9,
    summary10,
    summary11,
    summary12,
    summary13,
    summary14,
    summary15,
    summary16,
    summary17,
    summary18,
    summary19,
    summary20,
    summary21,
    summary22,
    summary23,
    summary24,
    summary25,
    summary26,
    summary27,
    summary28,
    summary29,
    summary30,
    summary31,
    summary32,
    summary33,
    summary34,
    summary35,
    summary36,
    summary37,
  ])
  return {
    props: {
      result: all.map((i)=>i.rows)
    },
  };
}

export const metadata = {
  title: "Records | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <Records result={pageData} />;
}
