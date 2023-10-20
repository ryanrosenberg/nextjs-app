import Database, { Statement } from "better-sqlite3";
import { cache } from "react";

const db = new Database("data/database.db");

export const getRoundsForTournamentQuery = db.prepare(`
    SELECT  number
    FROM    round
    WHERE   tournament_id = ?
    ORDER BY number
`);

export const getTossupForDetailQuery = db.prepare(`
SELECT      tossup.id,
            tossup.question,
            tossup.answer,
            tossup.slug,
            tossup.metadata,
            tossup.author,
            tossup.editor,
            tossup.category,
            tossup.subcategory,
            tossup.subsubcategory,
            COUNT(DISTINCT game.id) AS heard,
            AVG(IIF(buzz.value > 0, buzz.buzz_position, NULL)) AS average_buzz
FROM        buzz
LEFT JOIN   tossup on tossup_id = tossup.id
LEFT JOIN   game on buzz.game_id = game.id
WHERE       tossup.id = ?
GROUP BY    tossup.id,
tossup.question,
tossup.answer,
tossup.slug,
tossup.metadata,
tossup.author,
tossup.editor,
tossup.category,
tossup.subcategory,
tossup.subsubcategory`);

export const getBonusPartsQuery = db.prepare(`
    SELECT  bonus.id,
            bonus.leadin,
            bonus_part.part,
            bonus_part.answer,
            bonus_part.difficulty_modifier,
            bonus_part.value,
            bonus.metadata,
            bonus.author,
            bonus.editor,
            bonus.category,
            bonus.subcategory,
            bonus.subsubcategory
    FROM    bonus
    JOIN    question_set ON question_set.id = bonus.question_set_id
    JOIN    tournament ON question_set.id = tournament.question_set_id
    JOIN    bonus_part on bonus.id = bonus_part.bonus_id
    WHERE   tournament.id = ?
        AND bonus.id = ?
    ORDER BY part_number
`);

export const getDirectsByBonusQuery = db.prepare(`
    SELECT  team.name AS team_name,
            team.slug AS team_slug,
            opponent.name AS opponent_name,
            opponent.slug AS opponent_slug,
            part_one_direct.value AS part_one,
            part_two_direct.value AS part_two,
            part_three_direct.value AS part_three,
            part_one_direct.value + part_two_direct.value + part_three_direct.value AS total
    FROM    bonus
    JOIN    bonus_part part_one ON bonus.id = part_one.bonus_id
        AND part_one.part_number = 1
    JOIN    bonus_part part_two ON bonus.id = part_two.bonus_id
        AND part_two.part_number = 2
    JOIN    bonus_part part_three ON bonus.id = part_three.bonus_id
        AND part_three.part_number = 3
    JOIN    bonus_part_direct part_one_direct ON part_one.id = part_one_direct.bonus_part_id
    JOIN    bonus_part_direct part_two_direct ON part_two.id = part_two_direct.bonus_part_id
        AND part_one_direct.team_id = part_two_direct.team_id
    JOIN    bonus_part_direct part_three_direct ON part_three.id = part_three_direct.bonus_part_id
        AND part_one_direct.team_id = part_three_direct.team_id 
    JOIN    team ON part_one_direct.team_id = team.id
    JOIN    game ON part_one_direct.game_id = game.id
    JOIN    team opponent ON (team.id <> team_one_id AND opponent.id = team_one_id)
    OR  (team.id <> team_two_id AND opponent.id = team_two_id)
    WHERE   bonus.id = ?
        AND team.tournament_id = ? 
`);

export const getBuzzesByTossupQuery = db.prepare(`
    SELECT  buzz.id,
            player_id,
            player.name AS player_name,
            player.slug AS player_slug,
            team.name AS team_name,
            team.slug AS team_slug,
            opponent.name AS opponent_name,
            opponent.slug AS opponent_slug,
            game_id,
            tossup_id,
            buzz_position,
            value
    FROM    buzz
    JOIN    player ON player_id = player.id
    JOIN    team ON team_id = team.id
    JOIN    game ON game_id = game.id
    JOIN    team opponent ON (team.id <> team_one_id AND opponent.id = team_one_id)
        OR  (team.id <> team_two_id AND opponent.id = team_two_id)
    WHERE   buzz.tossup_id = ?
        AND team.tournament_id = ? 
`);

export const getTournamentsQuery = db.prepare(`
    SELECT  id,
            name, 
            slug, 
            location, 
            level, 
            start_date, 
            end_date 
    FROM    tournament
    ORDER BY start_date desc`);

export const getTournamentBySlugQuery = db.prepare(`
    SELECT  tournament.id,
            tournament.name, 
            question_set.slug as slug, 
            question_set_id,
            location, 
            level, 
            start_date, 
            end_date 
    FROM    tournament
    JOIN    question_set ON question_set_id = question_set.id
    WHERE   question_set.slug = ?`);

// export const getTossupsByTournamentQuery = db.prepare(`SELECT * from tossup`);

export const getTossupsByTournamentQuery = db.prepare(`
SELECT      question_set.slug as set_slug,
            tossup.id,
            tossup.question,
            tossup.answer,
            tossup.slug,
            tossup.category_full AS category,
            COUNT(DISTINCT game.id) AS heard,
            ROUND(CAST(SUM(IIF(buzz.value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS conversion_rate,
            ROUND(CAST(SUM(IIF(buzz.value > 10, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS power_rate,
            ROUND(CAST(SUM(IIF(buzz.value < 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS neg_rate,
            MIN(IIF(buzz.value > 0, buzz.buzz_position, NULL)) AS first_buzz,
            AVG(IIF(buzz.value > 0, buzz.buzz_position, NULL)) AS average_buzz
FROM        buzz
LEFT JOIN   tossup on tossup_id = tossup.id
LEFT JOIN   question_set on tossup.question_set_id = question_set.id
LEFT JOIN   game on buzz.game_id = game.id
WHERE       question_set.id = ?
GROUP BY    tossup.id,
            question_set.slug,
            tossup.answer,
            tossup.slug,
            tossup.category_full
ORDER BY    category_full`);

export const getTossupCategoryStatsQuery = db.prepare(`
    SELECT  case when tossup.subcategory is not null then tossup.category || ' - ' || tossup.subcategory else tossup.category end AS category,
    COUNT(DISTINCT game.id) AS heard,
    ROUND(CAST(SUM(IIF(buzz.value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS conversion_rate,
    ROUND(CAST(SUM(IIF(buzz.value > 10, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS power_rate,
    ROUND(CAST(SUM(IIF(buzz.value < 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT game.id), 3) AS neg_rate,
    MIN(IIF(buzz.value > 0, buzz.buzz_position, NULL)) AS first_buzz,
    AVG(IIF(buzz.value > 0, buzz.buzz_position, NULL)) AS average_buzz
            FROM        buzz
            LEFT JOIN   tossup on tossup_id = tossup.id
            LEFT JOIN   question_set on tossup.question_set_id = question_set.id
            LEFT JOIN   game on buzz.game_id = game.id
            WHERE       question_set.id = ?
    GROUP BY tossup.category, tossup.subcategory
`);

export const getBonusesByTournamentQuery = db.prepare(`
SELECT bonus.id,
question_set.slug as tournament_slug,
bonus.category_full AS category,
easy_part.answer AS easy_part,
medium_part.answer AS medium_part,
hard_part.answer AS hard_part,
easy_part.answer_sanitized AS easy_part_sanitized,
medium_part.answer_sanitized AS medium_part_sanitized,
hard_part.answer_sanitized AS hard_part_sanitized,
easy_part.part_number AS easy_part_number,
medium_part.part_number AS medium_part_number,
hard_part.part_number AS hard_part_number,
easy_part_direct.heard,
ROUND((easy_part_direct.easy_conversion + medium_part_direct.medium_conversion + hard_part_direct.hard_conversion)*10, 3) as ppb,
ROUND(easy_part_direct.easy_conversion, 3) as easy_conversion,
ROUND(medium_part_direct.medium_conversion, 3) as medium_conversion,
ROUND(hard_part_direct.hard_conversion, 3) as hard_conversion
           FROM bonus
LEFT JOIN question_set on question_set_id = question_set.id
JOIN    bonus_part easy_part on bonus.id = easy_part.bonus_id
AND easy_part.difficulty_modifier = 'e'
JOIN    bonus_part medium_part on bonus.id = medium_part.bonus_id
AND medium_part.difficulty_modifier = 'm'
JOIN    bonus_part hard_part on bonus.id = hard_part.bonus_id
AND hard_part.difficulty_modifier = 'h'
LEFT JOIN (
    SELECT bonus_part_id, COUNT(DISTINCT id) AS heard,
            CAST(SUM(IIF(value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT id) AS easy_conversion
    FROM bonus_part_direct
    GROUP BY bonus_part_id
) easy_part_direct ON easy_part.id = easy_part_direct.bonus_part_id
LEFT JOIN  (
    SELECT bonus_part_id, CAST(SUM(IIF(value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT id) AS medium_conversion
    FROM bonus_part_direct
    GROUP BY bonus_part_id
) medium_part_direct ON medium_part.id = medium_part_direct.bonus_part_id
LEFT JOIN  (
    SELECT bonus_part_id, CAST(SUM(IIF(value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT id) AS hard_conversion
    FROM bonus_part_direct
    GROUP BY bonus_part_id
) hard_part_direct ON hard_part.id = hard_part_direct.bonus_part_id
WHERE bonus.question_set_id = ?
ORDER BY category`);

export const getBonusCategoryStatsQuery = db.prepare(`
SELECT DISTINCT bonus_category.category_slug as category, 
heard_ppb.heard,
heard_ppb.ppb,
easy_part_direct.easy_conversion, 
medium_part_direct.medium_conversion, 
hard_part_direct.hard_conversion
FROM
(SELECT bonus.question_set_id,
case when bonus.subcategory is not null then bonus.category || ' - ' || bonus.subcategory else bonus.category end AS category_slug
FROM bonus) bonus_category
LEFT JOIN (
SELECT 
case when bonus.subcategory is not null then bonus.category || ' - ' || bonus.subcategory else bonus.category end AS category,
COUNT(DISTINCT bonus_part_direct.id)/3 AS heard,
CAST(SUM(bonus_part_direct.value) AS FLOAT) / (COUNT(DISTINCT bonus_part_direct.id)/3) AS ppb
FROM bonus_part_direct
LEFT JOIN bonus_part ON bonus_part_direct.bonus_part_id = bonus_part.id
LEFT JOIN bonus ON bonus_part.bonus_id = bonus.id
GROUP BY category, subcategory
) heard_ppb ON bonus_category.category_slug = heard_ppb.category
LEFT JOIN (
SELECT 
case when bonus.subcategory is not null then bonus.category || ' - ' || bonus.subcategory else bonus.category end AS category,
ROUND(CAST(SUM(IIF(bonus_part_direct.value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT bonus_part_direct.id), 3) as easy_conversion
FROM bonus_part_direct
LEFT JOIN bonus_part ON bonus_part_direct.bonus_part_id = bonus_part.id
LEFT JOIN bonus ON bonus_part.bonus_id = bonus.id
WHERE bonus_part.difficulty_modifier = 'e'
GROUP BY category, subcategory
) easy_part_direct ON bonus_category.category_slug = easy_part_direct.category
LEFT JOIN  (
SELECT 
case when bonus.subcategory is not null then bonus.category || ' - ' || bonus.subcategory else bonus.category end AS category,
ROUND(CAST(SUM(IIF(bonus_part_direct.value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT bonus_part_direct.id), 3) as medium_conversion
FROM bonus_part_direct
LEFT JOIN bonus_part ON bonus_part_direct.bonus_part_id = bonus_part.id
LEFT JOIN bonus ON bonus_part.bonus_id = bonus.id
WHERE bonus_part.difficulty_modifier = 'm'
GROUP BY category, subcategory
) medium_part_direct ON bonus_category.category_slug = medium_part_direct.category
LEFT JOIN  (
SELECT 
case when bonus.subcategory is not null then bonus.category || ' - ' || bonus.subcategory else bonus.category end AS category,
ROUND(CAST(SUM(IIF(bonus_part_direct.value > 0, 1, 0)) AS FLOAT) / COUNT(DISTINCT bonus_part_direct.id), 3) as hard_conversion
FROM bonus_part_direct
LEFT JOIN bonus_part ON bonus_part_direct.bonus_part_id = bonus_part.id
LEFT JOIN bonus ON bonus_part.bonus_id = bonus.id
WHERE bonus_part.difficulty_modifier = 'h'
GROUP BY category, subcategory
) hard_part_direct ON bonus_category.category_slug = hard_part_direct.category
WHERE bonus_category.question_set_id = ?
ORDER BY category
`);

export const getQuestionSetQuery = db.prepare(`
    SELECT  id,
            name,
            slug,
            difficulty
    FROM    question_set
    WHERE   id = ?
`);

export const getPlayerLeaderboard = db.prepare(`
WITH raw_buzzes AS (
    SELECT 	DISTINCT tossup_id,
            buzz_position
    FROM 	tossup
    JOIN	game ON game_id = game.id
    JOIN	round ON round_id = round.id
    JOIN	buzz ON tossup_id = tossup.id
    WHERE	exclude_from_individual = 0
        AND round.tournament_id = 1
        AND value > 0
    ), 
    buzz_ranks AS (
        SELECT	tossup_id,
                buzz_position,
                (SELECT COUNT()+1 FROM (
                    SELECT buzz_position FROM raw_buzzes b2 WHERE b2.buzz_position < b1.buzz_position AND b1.tossup_id = b2.tossup_id
                )) as row_num
        FROM	raw_buzzes b1
    )
    SELECT	buzz.player_id,
            player.name,
            team.name as team,
            sum(iif(buzz.value > 10, 1, 0)) as powers,
            sum(iif(buzz.value = 10, 1, 0)) as gets,
            sum(iif(buzz.value < 0, 1, 0)) as negs,
            sum(iif(buzz.value > 10, 15, iif(buzz.value = 10, 10, iif(buzz.value < 0, -5, 0)))) as points,
            min(iif(buzz.value > 0, buzz.buzz_position, NULL)) earliest_buzz,
            avg(iif(buzz.value > 0, buzz.buzz_position, NULL)) average_buzz,
            sum(iif(first.tossup_id is not null, 1, 0)) as first_buzzes,
            sum(iif(top_three.tossup_id is not null, 1, 0)) as top_three_buzzes,
            sum(iif(neg.tossup_id is not null, 1, 0)) bouncebacks
    FROM	tournament
    JOIN	round ON round.tournament_id = tournament.id
    JOIN	game ON round_id = round.id
    JOIN	buzz ON buzz.game_id = game.id
    JOIN	player ON buzz.player_id = player.id
    JOIN	team ON player.team_id = team.id
    LEFT JOIN	buzz_ranks first ON buzz.tossup_id = first.tossup_id AND buzz.buzz_position = first.buzz_position AND first.row_num = 1 AND buzz.value > 0
    LEFT JOIN   buzz_ranks top_three ON buzz.tossup_id = top_three.tossup_id AND buzz.buzz_position = top_three.buzz_position AND top_three.row_num < 3 AND buzz.value > 0
    LEFT JOIN	buzz neg ON buzz.game_id = neg.game_id AND buzz.tossup_id = neg.tossup_id AND buzz.value > 0 AND neg.value < 0
    WHERE	round.tournament_id = ?
        AND	exclude_from_individual = 0
    group by buzz.player_id, player.name, team.name
`);

export const get = cache(function get<T>(
  statement: Statement,
  ...params: any[]
) {
  return statement.get(...params) as T;
});

export const all = cache(function all<T>(
  statement: Statement,
  ...params: any[]
) {
  return statement.all(...params) as T;
});
