import Records from "./records-page";
import { neon } from '@neondatabase/serverless';
import { cache } from 'react'

async function getData(params) {
  const sql = neon(process.env.DATABASE_URL);
  // Most Wins -- School
  const summary1 = sql`
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
  // Highest Winning Percentage -- Team
  const summary2 = sql`
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
  // Most Tournaments Won -- School
  const summary3 = sql`SELECT 
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
  // Most ACF Nationals and DI ICT Titles -- School
  const summary4 = sql`
  SELECT 
  coalesce(nats.school, ict.school) as school,
  coalesce(nats.slug, ict.slug) as slug,
  coalesce(nats.nats, 0) as nats, 
  coalesce(ict.ict, 0) as ict, 
  coalesce(nats.nats, 0) + coalesce(ict.ict, 0) as total 
  from
  (SELECT 
  schools.school_name as School, 
  champions.tournament, 
  schools.slug,
  count(schools.slug) as nats
  from champions
  left join teams on champions.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  WHERE champions.tournament = 'ACF Nationals'
  GROUP BY 1, 2, 3) nats
  FULL JOIN
  (SELECT 
  schools.school_name as School, 
  champions.tournament, 
  schools.slug,
  count(schools.slug) as ict
  from champions
  left join teams on champions.team_id = teams.team_id
  left join schools on teams.school_id = schools.school_id
  WHERE champions.tournament = 'DI ICT'
  GROUP BY 1, 2, 3) ict
  ON nats.slug = ict.slug
  ORDER BY Total desc`;
  // Most Wins in a Season -- Team
  const summary5 = sql`
  SELECT 
  year as Season, 
  team as \"Team\", 
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
  // Most Tournaments Won in a Season -- School
  const summary6 = sql`
  SELECT 
  sets.year as Season, 
  team as \"Team\", 
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
  // Highest National Tournament PP20TUH -- Team
  const summary7 = sql`SELECT *
  FROM (
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  sum(total_pts)*20/sum(coalesce(tuh, 20))::numeric as PP20TUH
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

  // Highest National Tournament TU% -- Team
  const summary8 = sql`
  SELECT 
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  (sum(coalesce(powers, 0))+sum(tens)::numeric)/nullif(sum(coalesce(tuh, 20)), 0) as \"TU%\"
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and \"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10`;
  
  // Highest National Tournament PPB (normalized) -- Team
  const summary9 = sql`
  Select 
  teams.*,
  summ.mean,
  summ.sd,
  (teams.PPB - summ.mean)/summ.sd as z
  FROM
  (SELECT 
  sets.year as Season, 
  team_games.tournament_id,
  \"set\" as Tournament, 
  \"set\", 
  sets.set_id,
  site, 
  team as Team, 
  (sum(bonus_pts)::numeric/nullif(sum(bonuses_heard), 0)) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.\"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6, 7) teams
  LEFT JOIN
  (SELECT 
  a.set_id,
  avg(a.PPB) as mean,
  stddev_pop(a.PPB) as sd
  FROM
  (SELECT 
  sets.year as Season, 
  team_games.tournament_id,
  \"set\" as Tournament, 
  \"set\", 
  sets.set_id,
  site, 
  team as Team, 
  (sum(bonus_pts)::numeric/nullif(sum(bonuses_heard), 0)) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.\"set\" in ('DI ICT', 'ACF Nationals')
  GROUP BY 1, 2, 3, 4, 5, 6, 7) a
  GROUP BY 1) summ
  on teams.set_id = summ.set_id
  ORDER BY z desc
  LIMIT 10`;
  // Highest Tournament PP20TUH -- Team
  const summary10 = sql`
  SELECT 
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  sum(total_pts)*20/sum(coalesce(tuh, 20))::numeric as PP20TUH
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10`;
  // Highest Tournament TU% -- Team
  const summary11 = sql`
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  (sum(coalesce(powers, 0))+sum(tens))/sum(coalesce(tuh, 20))::numeric as \"TU%\"
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6
  ORDER BY 7 desc
  LIMIT 10`;
  // Highest Tournament PPB (normalized) -- Team
  const summary12 = sql`
  Select 
  teams.*,
  summ.mean,
  summ.sd,
  (teams.PPB - summ.mean)/nullif(summ.sd, 0) as z
  FROM
  (SELECT 
  sets.year as Season, 
  team_games.tournament_id,
  \"set\" as Tournament, 
  \"set\", 
  sets.set_id,
  site, 
  team as Team, 
  (sum(bonus_pts)::numeric/nullif(sum(bonuses_heard), 0)) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6, 7) teams
  LEFT JOIN
  (SELECT 
  a.set_id,
  avg(a.PPB) as mean,
  stddev_pop(a.PPB) as sd
  FROM
  (SELECT 
  sets.year as Season, 
  team_games.tournament_id,
  \"set\" as Tournament, 
  \"set\", 
  sets.set_id,
  site, 
  team as Team, 
  (sum(bonus_pts)::numeric/nullif(sum(bonuses_heard), 0)) as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  and sets.difficulty <> 'easy'
  GROUP BY 1, 2, 3, 4, 5, 6, 7) a
  GROUP BY 1) summ
  on teams.set_id = summ.set_id
  ORDER BY z desc
  LIMIT 10`;
  // Most Points in a Game, Winning Team
  const summary13 = sql`
  SELECT 
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
  // Most PP20TUH in a Full Game, Winning Team
  const summary14 = sql`
  SELECT 
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team as \"Team\", 
  team_games.tournament_id,
  game_id, 
  coalesce(tuh, 20) as TUH,
  total_pts as Pts,
  total_pts*20/coalesce(tuh, 20)::numeric as PP20TUH
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
  // Most Points in a Game, Both Teams
  const summary15 = sql`
  SELECT
  sets.year as Season,
  \"set\" as Tournament, 
  \"set\", 
  site, 
  team_games.tournament_id, 
  game_id, 
  string_agg(team, ' vs. ') as Teams, 
  string_agg(total_pts::text, ' - ') as Score, 
  coalesce(max(tuh), 20) as TUH,
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
  // Most PP20TUH in a Game, Both Teams
  const summary16 = sql`
  SELECT sets.year as Season,
  \"set\" as Tournament, 
  \"set\", site,
  game_id, 
  team_games.tournament_id,
  string_agg(team, ' vs. ') as Teams, 
  string_agg(cast(total_pts as text), ' - ') as Score, 
  sum(total_pts) as Pts,
  coalesce(max(tuh), 20) as TUH,
  sum(total_pts::numeric)*20/coalesce(avg(tuh), 20) as PP20TUH
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
  // Most Negs in a Game -- Team
  const summary17 = sql`
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
  // Highest PPB in a Game
  const summary18 = sql`
  SELECT 
  sets.year as Season,
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
  bonuses_heard as BHrd,
  bonus_pts as BPts,
  bonus_pts/bonuses_heard::numeric as PPB
  from team_games
  left join teams on team_games.team_id = teams.team_id
  left join tournaments on team_games.tournament_id = tournaments.tournament_id
  left join sets on tournaments.set_id = sets.set_id
  left join sites on tournaments.site_id = sites.site_id
  where teams.school is not null
  and sets.difficulty <> 'easy'
  and bonuses_heard >= 8
  order by PPB desc
  LIMIT 10`;
  // Most Grails
  const summary19 = sql`
  SELECT 
  sets.year as Season,
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
  // Most Points Scored -- Player
  const summary20 = sql`
  SELECT fname || ' ' || lname as Player, 
  slug,
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
  LIMIT 10`;
  // Most Tournaments Played -- Player
  const summary21 = sql`
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
  // Most National Tournaments Played
  const summary22 = sql`
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
  // Most Wins -- Player
  const summary23 = sql`
  SELECT 
  fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
  sum(case when result = 1 then 1 else 0 end) as Wins
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
  ORDER BY Wins desc
  LIMIT 10`;
  // Most Tournament Wins -- Player
  const summary24 = sql`
  SELECT 
  fname || ' ' || lname as Player, 
  slug,
  replace(string_agg(distinct school, ', '), ',', ', ') as Schools,
  sum(case when rank = 1 then 1 else 0 end) as Wins
  from 
  (select distinct player_id, tournament_id, set_id, team_id from player_games) player_games
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
  // Highest Winning Percentage -- Player
  const summary25 = sql`
  select a.* from (
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
  // Most Points in a Season -- Player
  const summary26 = sql`
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
  // Highest PP20TUH in a Season -- Player
  const summary27 = sql`
  Select * from (
    SELECT 
    sets.year as Season, 
    school as School,
    fname || ' ' || lname as Player, 
    people.slug as player_slug, 
    schools.slug as school_slug,
    count(distinct tournament_id) as Ts,
    count(tournament_id) as GP,
    sum(pts) as Pts,
    sum(pts)*20/nullif(sum(coalesce(tuh, 20)), 0)::numeric as PP20TUH
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
  // Highest Winning Percentage in a Season -- Player
  const summary28 = sql` 
  Select * from (
    SELECT 
    sets.year as Season,
    fname || ' ' || lname as Player,
    people.slug as player_slug, 
    schools.slug as school_slug,
    school as School,
    count(distinct tournament_id) as Ts,
    count(player_games.game_id) as GP,
    avg(result) as \"Win%\"
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
  // Highest PP20TUH in a Tournament -- Player
  const summary29 = sql`
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
    sum(pts)*20/nullif(sum(coalesce(tuh, 20)), 0)::numeric as rawPP20TUH
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
    where rawPP20TUH is not null
    LIMIT 10`;
  // Highest PP20TUH in a National Tournament -- Player
  const summary30 = sql`
  Select 
  a.*, 
  a.rawPP20TUH as PP20TUH 
  from 
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
    sum(pts::numeric)*20/nullif(sum(coalesce(tuh, 20)), 0) as rawPP20TUH
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
  // Most Negs per 20 TUH in a Tournament -- Player
  const summary31 = sql`
  Select a.* from (
    SELECT 
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
    sum(negs) as \"-5\",
    sum(negs)*20/nullif(sum(coalesce(tuh, 20)), 0)::numeric as \"-5P20TUH\"
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
    and \"-5P20TUH\" is not null
    LIMIT 10`;
  // Most Points in a Game
  const summary32 = sql`
  Select a.* from (
    SELECT 
    sets.year as Season,
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
  // Most Points in a National Tournament Game
  const summary33 = sql`
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
    and sets.\"set\" in ('DI ICT', 'ACF Nationals')
    ORDER BY Pts desc) a
    LIMIT 10`;
  // Most Tossups in a Game
  const summary34 = sql`Select a.* from (
    SELECT 
    sets.year as Season,
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
  // Most Negs in a Game
  const summary35 = sql`
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
    negs as \"-5\"
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
  // Most Tournaments Hosted
  const summary36 = sql`
  SELECT 
  school as School, 
  slug,
  count(distinct tournaments.tournament_id) as Tournaments
  from tournaments
  left join sites on tournaments.site_id = sites.site_id
  left join schools on sites.school = schools.school_name
  where school is not null
  GROUP BY 1, 2
  ORDER BY 3 desc
  LIMIT 10`;
  // Largest Tournaments Hosted
  const summary37 = sql`
  SELECT 
  tournaments.tournament_id,
  sets.year as Year, 
  \"set\" as \"Tournament\",
  site as Host, 
  school, 
  slug,
  count(distinct team_id) as Teams
from team_games
left join sets on team_games.set_id = sets.set_id
left join tournaments on team_games.tournament_id = tournaments.tournament_id
left join sites on tournaments.site_id = sites.site_id
left join schools on sites.school = schools.school_name
where school is not null
and \"set\" not in ('DI ICT', 'ACF Nationals')
GROUP BY 1, 2, 3, 4, 5, 6
ORDER BY Teams desc
LIMIT 10`;
  
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
      result: all
    },
  };
}

const cachedData = cache(getData)

export const metadata = {
  title: "Records | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await cachedData();
  // Forward fetched data to your Client Component
  return <Records result={pageData} />;
}
