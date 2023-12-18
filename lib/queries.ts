import Database, { Statement } from 'better-sqlite3';
import { cache } from 'react';
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL);

const db = new Database('data/database.db');

export const getCategoriesForTournamentQuery = `
    SELECT  DISTINCT category_main_slug AS category_slug
    FROM    buzzpoints_question
    JOIN    buzzpoints_packet_question ON buzzpoints_question.id = question_id
    JOIN    buzzpoints_packet ON buzzpoints_packet_question.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_question_set_edition ON buzzpoints_packet.question_set_edition_id = buzzpoints_question_set_edition.id
    JOIN    buzzpoints_tournament ON buzzpoints_question_set_edition.id = buzzpoints_tournament.question_set_edition_id
    WHERE   buzzpoints_tournament.id = $1
    ORDER BY category_main_slug
`;

export const getRoundsForTournamentQuery = `
    SELECT  number
    FROM    buzzpoints_round
    WHERE   tournament_id = $1
    ORDER BY number
`;

export const getTossupForDetailQuery = `
    SELECT  buzzpoints_tossup.id,
            buzzpoints_packet_question.question_number,
            buzzpoints_tossup.question,
            buzzpoints_tossup.answer,
            buzzpoints_question.slug,
            buzzpoints_question.metadata,
            buzzpoints_question.author,
            buzzpoints_question.editor,
            buzzpoints_question.category,
            buzzpoints_question.subcategory,
            buzzpoints_question.subsubcategory,
            (
                SELECT  count(buzzpoints_game.id)
                FROM    buzzpoints_game
                JOIN    buzzpoints_round ON round_id = buzzpoints_round.id
                JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
                WHERE   buzzpoints_packet_question.packet_id = buzzpoints_packet.id
                    AND buzzpoints_packet_question.question_number <= buzzpoints_game.tossups_read
                    AND tournament_id = buzzpoints_tournament.id
            ) as heard,
            (
                SELECT  AVG(buzz_position)
                FROM    buzzpoints_buzz
                JOIN    buzzpoints_game ON game_id = buzzpoints_game.id
                JOIN    buzzpoints_round ON round_id = buzzpoints_round.id
                WHERE   tossup_id = buzzpoints_tossup.id
                    AND tournament_id = buzzpoints_tournament.id
                    AND buzzpoints_buzz.value > 0
            ) as average_buzz
    FROM    buzzpoints_tossup
    JOIN    buzzpoints_question ON buzzpoints_tossup.question_id = buzzpoints_question.id
    JOIN    buzzpoints_packet_question ON buzzpoints_question.id = buzzpoints_packet_question.question_id
    JOIN    buzzpoints_packet ON buzzpoints_packet_question.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_question_set_edition ON buzzpoints_packet.question_set_edition_id = buzzpoints_question_set_edition.id
    JOIN    buzzpoints_tournament ON buzzpoints_question_set_edition.id = buzzpoints_tournament.question_set_edition_id
    JOIN    buzzpoints_round ON buzzpoints_tournament.id = buzzpoints_round.tournament_id
        AND buzzpoints_round.packet_id = buzzpoints_packet.id
    WHERE   buzzpoints_tournament.id = $1
        AND buzzpoints_round.number = $2
        AND buzzpoints_packet_question.question_number = $3`;


export const getBonusPartsQuery = `
    SELECT  question_number,
            buzzpoints_bonus.leadin,
            buzzpoints_bonus_part.part,
            buzzpoints_bonus_part.answer,
            buzzpoints_bonus_part.difficulty_modifier,
            buzzpoints_bonus_part.value,
            buzzpoints_question.metadata,
            buzzpoints_question.author,
            buzzpoints_question.editor,
            buzzpoints_question.category,
            buzzpoints_question.subcategory,
            buzzpoints_question.subsubcategory
    FROM    buzzpoints_bonus
    JOIN    buzzpoints_question ON buzzpoints_bonus.question_id = buzzpoints_question.id
    JOIN    buzzpoints_packet_question ON buzzpoints_question.id = buzzpoints_packet_question.question_id
    JOIN    buzzpoints_packet ON buzzpoints_packet_question.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_question_set_edition ON buzzpoints_packet.question_set_edition_id = buzzpoints_question_set_edition.id
    JOIN    buzzpoints_tournament ON buzzpoints_question_set_edition.id = buzzpoints_tournament.question_set_edition_id
    JOIN    buzzpoints_round ON buzzpoints_round.packet_id = buzzpoints_packet.id and buzzpoints_round.tournament_id = buzzpoints_tournament.id
    JOIN    buzzpoints_bonus_part on buzzpoints_bonus.id = buzzpoints_bonus_part.bonus_id
    WHERE   buzzpoints_tournament.id = $1
        AND buzzpoints_round.number = $2
        AND question_number = $3
    ORDER BY part_number
`;

export const getDirectsByBonusQuery = `
    SELECT  buzzpoints_team.name AS team_name,
            buzzpoints_team.slug AS team_slug,
            opponent.name AS opponent_name,
            opponent.slug AS opponent_slug,
            part_one_direct.value AS part_one,
            part_two_direct.value AS part_two,
            part_three_direct.value AS part_three,
            part_one_direct.value + part_two_direct.value + part_three_direct.value AS total
    FROM    buzzpoints_bonus
    JOIN    buzzpoints_bonus_part part_one ON buzzpoints_bonus.id = part_one.bonus_id
        AND part_one.part_number = 1
    JOIN    buzzpoints_bonus_part part_two ON buzzpoints_bonus.id = part_two.bonus_id
        AND part_two.part_number = 2
    JOIN    buzzpoints_bonus_part part_three ON buzzpoints_bonus.id = part_three.bonus_id
        AND part_three.part_number = 3
    JOIN    buzzpoints_bonus_part_direct part_one_direct ON part_one.id = part_one_direct.bonus_part_id
    JOIN    buzzpoints_bonus_part_direct part_two_direct ON part_two.id = part_two_direct.bonus_part_id
        AND part_one_direct.team_id = part_two_direct.team_id
    JOIN    buzzpoints_bonus_part_direct part_three_direct ON part_three.id = part_three_direct.bonus_part_id
        AND part_one_direct.team_id = part_three_direct.team_id
    JOIN    buzzpoints_team ON part_one_direct.team_id = buzzpoints_team.id
    JOIN    buzzpoints_game ON part_one_direct.game_id = buzzpoints_game.id
    JOIN    buzzpoints_team opponent ON (buzzpoints_team.id <> team_one_id AND opponent.id = team_one_id)
    OR  (buzzpoints_team.id <> team_two_id AND opponent.id = team_two_id)
    JOIN    buzzpoints_question ON buzzpoints_bonus.question_id = buzzpoints_question.id
    JOIN    buzzpoints_packet_question ON buzzpoints_question.id = buzzpoints_packet_question.question_id
    JOIN    buzzpoints_packet ON buzzpoints_packet_question.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_question_set_edition ON buzzpoints_packet.question_set_edition_id = buzzpoints_question_set_edition.id
    JOIN    buzzpoints_tournament ON buzzpoints_question_set_edition.id = buzzpoints_tournament.question_set_edition_id
    JOIN    buzzpoints_round ON buzzpoints_round.packet_id = buzzpoints_packet.id and buzzpoints_round.tournament_id = buzzpoints_tournament.id
    WHERE   buzzpoints_team.tournament_id = $1
    AND     buzzpoints_round.number = $2
    AND     buzzpoints_packet_question.question_number = $3
`;

export const getBuzzesByTossupQuery = `
    SELECT  buzzpoints_buzz.id,
            player_id,
            buzzpoints_player.name AS player_name,
            buzzpoints_player.slug AS player_slug,
            buzzpoints_team.name AS team_name,
            buzzpoints_team.slug AS team_slug,
            opponent.name AS opponent_name,
            opponent.slug AS opponent_slug,
            game_id,
            tossup_id,
            buzz_position,
            value
    FROM    buzzpoints_buzz
    JOIN    buzzpoints_player ON player_id = buzzpoints_player.id
    JOIN    buzzpoints_team ON team_id = buzzpoints_team.id
    JOIN    buzzpoints_game ON game_id = buzzpoints_game.id
    JOIN    buzzpoints_team opponent ON (buzzpoints_team.id <> team_one_id AND opponent.id = team_one_id)
        OR  (buzzpoints_team.id <> team_two_id AND opponent.id = team_two_id)
    WHERE   buzzpoints_buzz.tossup_id = $1
        AND buzzpoints_team.tournament_id = $2
`;

export const getPlayersByTournamentQuery = `
    SELECT  buzzpoints_player.id,
            buzzpoints_player.name,
            buzzpoints_player.slug,
            buzzpoints_team.name AS team_name,
            buzzpoints_team.slug AS team_slug,
            buzzpoints_team.id AS team_id,
            buzzpoints_team.tournament_id AS tournament_id
    FROM    buzzpoints_player
    JOIN    buzzpoints_team ON player.team_id = buzzpoints_team.id
    WHERE   buzzpoints_team.tournament_id = $1
    ORDER BY player.name`;

export const getTeamsByTournamentQuery = `
    SELECT  buzzpoints_team.id,
            buzzpoints_team.name,
            buzzpoints_team.slug,
            buzzpoints_team.tournament_id
    FROM    buzzpoints_team
    WHERE   buzzpoints_team.tournament_id = $1
    ORDER BY buzzpoints_team.name`;

export const getTournamentsQuery = `
    SELECT  id,
            name,
            slug,
            location,
            level,
            start_date,
            end_date
    FROM    buzzpoints_tournament
    ORDER BY start_date desc`;

export const getTournamentBySlugQuery = `
    SELECT  id,
            name,
            slug,
            question_set_edition_id,
            location,
            level,
            start_date,
            end_date
    FROM    buzzpoints_tournament
    WHERE   slug = $1
    `;

export const getTossupsByTournamentQuery = `
    SELECT  buzzpoints_tossup.id,
            buzzpoints_tournament.slug AS tournament_slug,
            buzzpoints_round.number AS round,
            buzzpoints_packet_question.question_number,
            buzzpoints_tossup.question,
            buzzpoints_tossup.answer,
            buzzpoints_question.slug,
            buzzpoints_question.category_main AS category,
            COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id ELSE null END) AS heard,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id ELSE null END), 0), 3) AS conversion_rate,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id ELSE null END), 0), 3) AS power_rate,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id ELSE null END), 0), 3) AS neg_rate,
            MIN(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) AS first_buzz,
            AVG(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) AS average_buzz
    FROM    buzzpoints_tournament
    JOIN    buzzpoints_round ON buzzpoints_tournament.id = tournament_id
    JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
    JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
    JOIN    buzzpoints_tossup ON buzzpoints_question.id = buzzpoints_tossup.question_id
    JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
    LEFT JOIN buzzpoints_buzz ON buzzpoints_tossup.id = buzzpoints_buzz.tossup_id
		AND	buzzpoints_game.id = buzzpoints_buzz.game_id
    WHERE   buzzpoints_tournament.id = $1
    GROUP BY 
            buzzpoints_tossup.id,
            buzzpoints_tournament.slug,
            buzzpoints_round.number,
            buzzpoints_packet_question.question_number,
            buzzpoints_tossup.question,
            buzzpoints_tossup.answer,
            buzzpoints_question.slug,
            buzzpoints_question.category_main`;

export const getTossupCategoryStatsQuery = `
    SELECT  category_main AS category,
            buzzpoints_question.category_main_slug AS category_slug,
            buzzpoints_tournament.slug AS tournament_slug,
            COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id ELSE null END) AS heard,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id || '-' || buzzpoints_tossup.id ELSE null END), 3) AS conversion_rate,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id || '-' || buzzpoints_tossup.id ELSE null END), 3) AS power_rate,
            ROUND(CAST(SUM(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT CASE WHEN question_number <= tossups_read THEN buzzpoints_game.id || '-' || buzzpoints_tossup.id ELSE null END), 3) AS neg_rate,
            MIN(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) AS first_buzz,
            AVG(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) AS average_buzz
    FROM    buzzpoints_tournament
    JOIN    buzzpoints_round ON buzzpoints_tournament.id = tournament_id
    JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
    JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
    JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
    JOIN    buzzpoints_tossup ON buzzpoints_question.id = buzzpoints_tossup.question_id
    JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
    LEFT JOIN buzzpoints_buzz ON buzzpoints_tossup.id = buzzpoints_buzz.tossup_id
		AND	buzzpoints_game.id = buzzpoints_buzz.game_id
    WHERE   buzzpoints_tournament.id = $1
    GROUP BY buzzpoints_question.category_main, buzzpoints_question.category_main_slug, buzzpoints_tournament.slug
`;

export const getPlayerCategoryStatsQuery = `
WITH raw_buzzes AS (
    SELECT 	DISTINCT tossup_id,
            buzz_position
    FROM 	buzzpoints_tossup
    JOIN	buzzpoints_buzz ON tossup_id = buzzpoints_tossup.id
    JOIN	buzzpoints_game ON game_id = buzzpoints_game.id
    JOIN	buzzpoints_round ON round_id = buzzpoints_round.id
    WHERE	exclude_from_individual = 0
        AND tournament_id = $1
        AND value > 0
    ), buzz_ranks AS (
        SELECT	tossup_id,
                buzz_position,
                (SELECT COUNT(*)+1 FROM (
                    SELECT buzz_position FROM raw_buzzes b2 WHERE b2.buzz_position < b1.buzz_position AND b1.tossup_id = b2.tossup_id
                ) rn) as row_num
        FROM	raw_buzzes b1
    )
    SELECT	buzzpoints_buzz.player_id,
            buzzpoints_player.name,
            buzzpoints_team.name as team,
            category_main as category,
            category_main_slug as category_slug,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) as powers,
            sum(CASE WHEN buzzpoints_buzz.value = 10 THEN 1 ELSE 0 END) as gets,
            sum(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) as negs,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 15 ELSE CASE WHEN buzzpoints_buzz.value = 10 THEN 10 ELSE CASE WHEN buzzpoints_buzz.value < 0 THEN -5 ELSE 0 END END END) as points,
            min(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) earliest_buzz,
            avg(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) average_buzz,
            sum(CASE WHEN first.tossup_id is not null THEN 1 ELSE 0 END) as first_buzzes,
            sum(CASE WHEN top_three.tossup_id is not null THEN 1 ELSE 0 END) as top_three_buzzes,
            sum(CASE WHEN neg.tossup_id is not null THEN 1 ELSE 0 END) bouncebacks
    FROM	buzzpoints_tournament
    JOIN	buzzpoints_round ON buzzpoints_round.tournament_id = buzzpoints_tournament.id
    JOIN	buzzpoints_game ON round_id = buzzpoints_round.id
    JOIN	buzzpoints_buzz ON buzzpoints_buzz.game_id = buzzpoints_game.id
    JOIN	buzzpoints_player ON buzzpoints_buzz.player_id = buzzpoints_player.id
    JOIN	buzzpoints_team ON buzzpoints_team.id = buzzpoints_player.team_id
    JOIN    buzzpoints_tossup ON buzzpoints_tossup.id = buzzpoints_buzz.tossup_id
    JOIN    buzzpoints_question ON buzzpoints_tossup.question_id = buzzpoints_question.id
    LEFT JOIN	buzz_ranks first ON buzzpoints_buzz.tossup_id = first.tossup_id AND buzzpoints_buzz.buzz_position = first.buzz_position AND first.row_num = 1 AND buzzpoints_buzz.value > 0
    LEFT JOIN   buzz_ranks top_three ON buzzpoints_buzz.tossup_id = top_three.tossup_id AND buzzpoints_buzz.buzz_position = top_three.buzz_position AND top_three.row_num <= 3 AND buzzpoints_buzz.value > 0
    LEFT JOIN	buzzpoints_buzz neg ON buzzpoints_buzz.game_id = neg.game_id AND buzzpoints_buzz.tossup_id = neg.tossup_id AND buzzpoints_buzz.value > 0 AND neg.value < 0
    WHERE	buzzpoints_round.tournament_id = $2
        AND buzzpoints_player.slug = $3
        AND	exclude_from_individual = 0
    group by buzzpoints_buzz.player_id, buzzpoints_player.name, category_main, buzzpoints_team.name, category_main_slug
`;
 
export const getTeamCategoryStatsQuery = `
SELECT  buzzpoints_tournament.slug AS tournament_slug,
        buzzpoints_team.name,
        category_main AS category,
        category_main_slug AS category_slug,
        players.players,
        COUNT(DISTINCT easy_part_direct.id) AS heard,
        CAST(SUM(easy_part_direct.value + medium_part_direct.value + hard_part_direct.value) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id) AS ppb,
        ROUND(CAST(SUM(CASE WHEN easy_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS easy_conversion,
        ROUND(CAST(SUM(CASE WHEN medium_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS medium_conversion,
        ROUND(CAST(SUM(CASE WHEN hard_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS hard_conversion
FROM    buzzpoints_tournament
JOIN    buzzpoints_round ON buzzpoints_tournament.id = buzzpoints_round.tournament_id
JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus ON buzzpoints_bonus.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus_part easy_part on buzzpoints_bonus.id = easy_part.bonus_id
    AND easy_part.difficulty_modifier = 'e'
JOIN    buzzpoints_bonus_part medium_part on buzzpoints_bonus.id = medium_part.bonus_id
    AND medium_part.difficulty_modifier = 'm'
JOIN    buzzpoints_bonus_part hard_part on buzzpoints_bonus.id = hard_part.bonus_id
    AND hard_part.difficulty_modifier = 'h'
JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
LEFT JOIN buzzpoints_bonus_part_direct easy_part_direct ON easy_part.id = easy_part_direct.bonus_part_id
    AND	buzzpoints_game.id = easy_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct medium_part_direct ON medium_part.id = medium_part_direct.bonus_part_id
    AND	buzzpoints_game.id = medium_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct hard_part_direct ON hard_part.id = hard_part_direct.bonus_part_id
    AND	buzzpoints_game.id = hard_part_direct.game_id
JOIN buzzpoints_team ON buzzpoints_team.id = easy_part_direct.team_id
LEFT JOIN (SELECT team_id, string_agg(name, ', ') as players from buzzpoints_player GROUP BY team_id) players on buzzpoints_team.id = players.team_id
WHERE   buzzpoints_tournament.id = $1
    AND buzzpoints_team.slug = $2
GROUP BY buzzpoints_tournament.slug, buzzpoints_team.name, category_main, category_main_slug, players.players
`;

export const getBonusesByTournamentQuery = `
SELECT  buzzpoints_tournament.slug AS tournament_slug,
buzzpoints_round.number AS round,
question_number,
category_full AS category,
category_main_slug AS category_slug,
easy_part.answer AS easy_part,
medium_part.answer AS medium_part,
hard_part.answer AS hard_part,
easy_part.answer_sanitized AS easy_part_sanitized,
medium_part.answer_sanitized AS medium_part_sanitized,
hard_part.answer_sanitized AS hard_part_sanitized,
easy_part.part_number AS easy_part_number,
medium_part.part_number AS medium_part_number,
hard_part.part_number AS hard_part_number,
COUNT(DISTINCT easy_part_direct.id) AS heard,
CAST(SUM(easy_part_direct.value + medium_part_direct.value + hard_part_direct.value) AS NUMERIC) / NULLIF(COUNT(DISTINCT easy_part_direct.id), 0) AS ppb,
ROUND(CAST(SUM(CASE WHEN easy_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT easy_part_direct.id), 0), 3) AS easy_conversion,
ROUND(CAST(SUM(CASE WHEN medium_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT easy_part_direct.id), 0), 3) AS medium_conversion,
ROUND(CAST(SUM(CASE WHEN hard_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / NULLIF(COUNT(DISTINCT easy_part_direct.id), 0), 3) AS hard_conversion
FROM    buzzpoints_tournament
JOIN    buzzpoints_round ON buzzpoints_tournament.id = buzzpoints_round.tournament_id
JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus ON buzzpoints_bonus.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus_part easy_part on buzzpoints_bonus.id = easy_part.bonus_id
    AND easy_part.difficulty_modifier = 'e'
JOIN    buzzpoints_bonus_part medium_part on buzzpoints_bonus.id = medium_part.bonus_id
    AND medium_part.difficulty_modifier = 'm'
JOIN    buzzpoints_bonus_part hard_part on buzzpoints_bonus.id = hard_part.bonus_id
    AND hard_part.difficulty_modifier = 'h'
JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
LEFT JOIN buzzpoints_bonus_part_direct easy_part_direct ON easy_part.id = easy_part_direct.bonus_part_id
AND	buzzpoints_game.id = easy_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct medium_part_direct ON medium_part.id = medium_part_direct.bonus_part_id
AND	buzzpoints_game.id = medium_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct hard_part_direct ON hard_part.id = hard_part_direct.bonus_part_id
AND	buzzpoints_game.id = hard_part_direct.game_id
WHERE   buzzpoints_tournament.id = $1
GROUP BY 
 buzzpoints_tournament.slug,
 buzzpoints_round.number,
 question_number,
 category_full,
 category_main_slug,
 easy_part.answer,
 medium_part.answer,
 hard_part.answer,
 easy_part.answer_sanitized,
 medium_part.answer_sanitized,
 hard_part.answer_sanitized,
 easy_part.part_number,
 medium_part.part_number,
 hard_part.part_number`;

export const getBonusCategoryStatsQuery = `
SELECT  buzzpoints_question.category_main AS category,
        buzzpoints_question.category_main_slug AS category_slug,
        buzzpoints_tournament.slug as tournament_slug,
        COUNT(DISTINCT easy_part_direct.id) AS heard,
        CAST(SUM(easy_part_direct.value + medium_part_direct.value + hard_part_direct.value) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id) AS ppb,
        ROUND(CAST(SUM(CASE WHEN easy_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS easy_conversion,
        ROUND(CAST(SUM(CASE WHEN medium_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS medium_conversion,
        ROUND(CAST(SUM(CASE WHEN hard_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS hard_conversion
FROM    buzzpoints_tournament
JOIN    buzzpoints_round ON buzzpoints_tournament.id = buzzpoints_round.tournament_id
JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus ON buzzpoints_bonus.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus_part easy_part on buzzpoints_bonus.id = easy_part.bonus_id
    AND easy_part.difficulty_modifier = 'e'
JOIN    buzzpoints_bonus_part medium_part on buzzpoints_bonus.id = medium_part.bonus_id
    AND medium_part.difficulty_modifier = 'm'
JOIN    buzzpoints_bonus_part hard_part on buzzpoints_bonus.id = hard_part.bonus_id
    AND hard_part.difficulty_modifier = 'h'
JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
LEFT JOIN buzzpoints_bonus_part_direct easy_part_direct ON easy_part.id = easy_part_direct.bonus_part_id
AND	buzzpoints_game.id = easy_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct medium_part_direct ON medium_part.id = medium_part_direct.bonus_part_id
AND	buzzpoints_game.id = medium_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct hard_part_direct ON hard_part.id = hard_part_direct.bonus_part_id
AND	buzzpoints_game.id = hard_part_direct.game_id
WHERE   buzzpoints_tournament.id = $1
GROUP BY 
buzzpoints_question.category_main,
buzzpoints_question.category_main_slug,
buzzpoints_tournament.slug
`;

export const getPlayerCategoryLeaderboard = `
WITH raw_buzzes AS (
    SELECT 	DISTINCT tossup_id,
            buzz_position
    FROM 	buzzpoints_tossup
    JOIN	buzzpoints_buzz ON tossup_id = buzzpoints_tossup.id
    JOIN	buzzpoints_game ON game_id = buzzpoints_game.id
    JOIN	buzzpoints_round ON round_id = buzzpoints_round.id
    WHERE	exclude_from_individual = 0
        AND tournament_id = $1
        AND value > 0
    ), buzz_ranks AS (
        SELECT	tossup_id,
                buzz_position,
                (SELECT count(*)+1 FROM (
                    SELECT buzz_position FROM raw_buzzes b2 WHERE b2.buzz_position < b1.buzz_position AND b1.tossup_id = b2.tossup_id
                ) rn) as row_num
        FROM	raw_buzzes b1
    )
    SELECT	buzzpoints_buzz.player_id,
            buzzpoints_player.name,
            buzzpoints_player.slug,
            buzzpoints_team.name as team_name,
            buzzpoints_team.slug as team_slug,
            buzzpoints_tournament.slug as tournament_slug,
            buzzpoints_question.category_main as category,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) as powers,
            sum(CASE WHEN buzzpoints_buzz.value = 10 THEN 1 ELSE 0 END) as gets,
            sum(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) as negs,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 15 ELSE CASE WHEN buzzpoints_buzz.value = 10 THEN 10 ELSE CASE WHEN buzzpoints_buzz.value < 0 THEN -5 ELSE 0 END END END) as points,
            min(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) earliest_buzz,
            avg(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) average_buzz,
            sum(CASE WHEN first.tossup_id is not null THEN 1 ELSE 0 END) as first_buzzes,
            sum(CASE WHEN top_three.tossup_id is not null THEN 1 ELSE 0 END) as top_three_buzzes,
            sum(CASE WHEN neg.tossup_id is not null THEN 1 ELSE 0 END) bouncebacks
    FROM	buzzpoints_tournament
    JOIN	buzzpoints_round ON buzzpoints_round.tournament_id = buzzpoints_tournament.id
    JOIN	buzzpoints_game ON round_id = buzzpoints_round.id
    JOIN	buzzpoints_buzz ON buzzpoints_buzz.game_id = buzzpoints_game.id
    JOIN	buzzpoints_player ON buzzpoints_buzz.player_id = buzzpoints_player.id
    JOIN	buzzpoints_team ON buzzpoints_player.team_id = buzzpoints_team.id
    JOIN    buzzpoints_tossup ON buzzpoints_tossup.id = buzzpoints_buzz.tossup_id
    JOIN    buzzpoints_question ON buzzpoints_tossup.question_id = buzzpoints_question.id
    LEFT JOIN	buzz_ranks first ON buzzpoints_buzz.tossup_id = first.tossup_id AND buzzpoints_buzz.buzz_position = first.buzz_position AND first.row_num = 1 AND buzzpoints_buzz.value > 0
    LEFT JOIN   buzz_ranks top_three ON buzzpoints_buzz.tossup_id = top_three.tossup_id AND buzzpoints_buzz.buzz_position = top_three.buzz_position AND top_three.row_num <= 3 AND buzzpoints_buzz.value > 0
    LEFT JOIN	buzzpoints_buzz neg ON buzzpoints_buzz.game_id = neg.game_id AND buzzpoints_buzz.tossup_id = neg.tossup_id AND buzzpoints_buzz.value > 0 AND neg.value < 0
    WHERE	buzzpoints_round.tournament_id = $2
    AND buzzpoints_question.category_main_slug = $3
    AND	exclude_from_individual = 0
    group by 
    buzzpoints_buzz.player_id, 
    buzzpoints_player.name, 
    buzzpoints_player.slug, 
    buzzpoints_tournament.slug, 
    buzzpoints_question.category_main,
    buzzpoints_team.name,
    buzzpoints_team.slug
    ORDER BY points desc
`;


export const getTeamCategoryLeaderboard = `
SELECT  buzzpoints_tournament.slug,
        buzzpoints_question.category_main AS category,
        buzzpoints_team.name,
        buzzpoints_team.slug as team_slug,
        COUNT(DISTINCT easy_part_direct.id) AS heard,
        CAST(SUM(easy_part_direct.value + medium_part_direct.value + hard_part_direct.value) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id) AS ppb,
        ROUND(CAST(SUM(CASE WHEN easy_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS easy_conversion,
        ROUND(CAST(SUM(CASE WHEN medium_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS medium_conversion,
        ROUND(CAST(SUM(CASE WHEN hard_part_direct.value > 0 THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(DISTINCT easy_part_direct.id), 3) AS hard_conversion
FROM    buzzpoints_tournament
JOIN    buzzpoints_round ON buzzpoints_tournament.id = buzzpoints_round.tournament_id
JOIN    buzzpoints_packet ON buzzpoints_round.packet_id = buzzpoints_packet.id
JOIN    buzzpoints_packet_question ON buzzpoints_packet.id = buzzpoints_packet_question.packet_id
JOIN    buzzpoints_question ON buzzpoints_packet_question.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus ON buzzpoints_bonus.question_id = buzzpoints_question.id
JOIN    buzzpoints_bonus_part easy_part on buzzpoints_bonus.id = easy_part.bonus_id
    AND easy_part.difficulty_modifier = 'e'
JOIN    buzzpoints_bonus_part medium_part on buzzpoints_bonus.id = medium_part.bonus_id
    AND medium_part.difficulty_modifier = 'm'
JOIN    buzzpoints_bonus_part hard_part on buzzpoints_bonus.id = hard_part.bonus_id
    AND hard_part.difficulty_modifier = 'h'
JOIN    buzzpoints_game ON buzzpoints_round.id = buzzpoints_game.round_id
LEFT JOIN buzzpoints_bonus_part_direct easy_part_direct ON easy_part.id = easy_part_direct.bonus_part_id
AND	buzzpoints_game.id = easy_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct medium_part_direct ON medium_part.id = medium_part_direct.bonus_part_id
AND	buzzpoints_game.id = medium_part_direct.game_id
LEFT JOIN buzzpoints_bonus_part_direct hard_part_direct ON hard_part.id = hard_part_direct.bonus_part_id
AND	buzzpoints_game.id = hard_part_direct.game_id
JOIN buzzpoints_team ON buzzpoints_team.id = easy_part_direct.team_id
WHERE   buzzpoints_tournament.id = $1
AND     buzzpoints_question.category_main_slug = $2
GROUP BY buzzpoints_tournament.slug, category_main, buzzpoints_team.name, buzzpoints_team.slug
`;

export const getQuestionSetQuery = `
    SELECT  buzzpoints_question_set.id,
            buzzpoints_question_set.name,
            buzzpoints_question_set.slug,
            buzzpoints_question_set.difficulty,
            buzzpoints_question_set_edition.name as edition
    FROM    buzzpoints_question_set
    JOIN    buzzpoints_question_set_edition ON question_set_id = buzzpoints_question_set.id
    WHERE   buzzpoints_question_set_edition.id = $1
`;

export const getPlayerLeaderboard = `
WITH raw_buzzes AS (
    SELECT 	DISTINCT tossup_id,
            buzz_position
    FROM 	buzzpoints_tossup
    JOIN	buzzpoints_buzz ON tossup_id = buzzpoints_tossup.id
    JOIN	buzzpoints_game ON game_id = buzzpoints_game.id
    JOIN	buzzpoints_round ON round_id = buzzpoints_round.id
    WHERE	exclude_from_individual = 0
        AND tournament_id = $1
        AND value > 0
    ), buzz_ranks AS (
        SELECT	tossup_id,
                buzz_position,
                (SELECT COUNT(*)+1 FROM (
                    SELECT buzz_position FROM raw_buzzes b2 WHERE b2.buzz_position < b1.buzz_position AND b1.tossup_id = b2.tossup_id
                ) rn) row_num
        FROM	raw_buzzes b1
    )
    SELECT	buzzpoints_buzz.player_id,
            buzzpoints_player.name,
            buzzpoints_player.slug,
            buzzpoints_team.name as team_name,
            buzzpoints_team.slug as team_slug,
            buzzpoints_tournament.slug as tournament_slug,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) as powers,
            sum(CASE WHEN buzzpoints_buzz.value = 10 THEN 1 ELSE 0 END) as gets,
            sum(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) as negs,
            sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 15 ELSE CASE WHEN buzzpoints_buzz.value = 10 THEN 10 ELSE CASE WHEN buzzpoints_buzz.value < 0 THEN -5 ELSE 0 END END END) as points,
            min(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) earliest_buzz,
            avg(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) average_buzz,
            sum(CASE WHEN first.tossup_id is not null THEN 1 ELSE 0 END) as first_buzzes,
            sum(CASE WHEN top_three.tossup_id is not null THEN 1 ELSE 0 END) as top_three_buzzes,
            sum(CASE WHEN neg.tossup_id is not null THEN 1 ELSE 0 END) bouncebacks
    FROM	buzzpoints_tournament
    JOIN	buzzpoints_round ON buzzpoints_round.tournament_id = buzzpoints_tournament.id
    JOIN	buzzpoints_game ON round_id = buzzpoints_round.id
    JOIN	buzzpoints_buzz ON buzzpoints_buzz.game_id = buzzpoints_game.id
    JOIN	buzzpoints_player ON buzzpoints_buzz.player_id = buzzpoints_player.id
    JOIN	buzzpoints_team ON buzzpoints_player.team_id = buzzpoints_team.id
    LEFT JOIN	buzz_ranks first ON buzzpoints_buzz.tossup_id = first.tossup_id AND buzzpoints_buzz.buzz_position = first.buzz_position AND first.row_num = 1 AND buzzpoints_buzz.value > 0
    LEFT JOIN   buzz_ranks top_three ON buzzpoints_buzz.tossup_id = top_three.tossup_id AND buzzpoints_buzz.buzz_position = top_three.buzz_position AND top_three.row_num <= 3 AND buzzpoints_buzz.value > 0
    LEFT JOIN	buzzpoints_buzz neg ON buzzpoints_buzz.game_id = neg.game_id AND buzzpoints_buzz.tossup_id = neg.tossup_id AND buzzpoints_buzz.value > 0 AND neg.value < 0
    WHERE	buzzpoints_team.tournament_id = $2
        AND	exclude_from_individual = 0
    group by 
    buzzpoints_buzz.player_id, 
    buzzpoints_player.name, 
    buzzpoints_player.slug,
    buzzpoints_team.name,
    buzzpoints_team.slug,
    buzzpoints_tournament.slug
`;

export const getTeamLeaderboard = `
WITH raw_buzzes AS (
    SELECT 	DISTINCT tossup_id,
            buzz_position
    FROM 	buzzpoints_tossup
    JOIN	buzzpoints_buzz ON tossup_id = buzzpoints_tossup.id
    JOIN	buzzpoints_game ON game_id = buzzpoints_game.id
    JOIN	buzzpoints_round ON round_id = buzzpoints_round.id
    WHERE	exclude_from_individual = 0
        AND tournament_id = $1
        AND value > 0
    ), buzz_ranks AS (
        SELECT	tossup_id,
                buzz_position,
                (SELECT count(*)+1 FROM (
                    SELECT buzz_position FROM raw_buzzes b2 WHERE b2.buzz_position < b1.buzz_position AND b1.tossup_id = b2.tossup_id
                ) rn) as row_num
        FROM	raw_buzzes b1
    )
SELECT  buzzpoints_team.name,
        buzzpoints_team.slug,
        buzzpoints_tournament.slug as tournament_slug,
        sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 1 ELSE 0 END) as powers,
        sum(CASE WHEN buzzpoints_buzz.value = 10 THEN 1 ELSE 0 END) as gets,
        sum(CASE WHEN buzzpoints_buzz.value < 0 THEN 1 ELSE 0 END) as negs,
        sum(CASE WHEN neg.tossup_id is not null THEN 1 ELSE 0 END) bouncebacks,
        min(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) earliest_buzz,
        avg(CASE WHEN buzzpoints_buzz.value > 0 THEN buzzpoints_buzz.buzz_position ELSE NULL END) average_buzz,
        sum(CASE WHEN first.tossup_id is not null THEN 1 ELSE 0 END) as first_buzzes,
        sum(CASE WHEN top_three.tossup_id is not null THEN 1 ELSE 0 END) as top_three_buzzes,
        sum(CASE WHEN buzzpoints_buzz.value > 10 THEN 15 ELSE CASE WHEN buzzpoints_buzz.value = 10 THEN 10 ELSE CASE WHEN buzzpoints_buzz.value < 0 THEN -5 ELSE 0 END END END) as points
    FROM	buzzpoints_tournament
    JOIN	buzzpoints_round ON buzzpoints_round.tournament_id = buzzpoints_tournament.id
    JOIN	buzzpoints_game ON round_id = buzzpoints_round.id
    JOIN	buzzpoints_buzz ON buzzpoints_buzz.game_id = buzzpoints_game.id
    JOIN	buzzpoints_player ON buzzpoints_buzz.player_id = buzzpoints_player.id
    JOIN	buzzpoints_team ON buzzpoints_player.team_id = buzzpoints_team.id
    LEFT JOIN	buzz_ranks first ON buzzpoints_buzz.tossup_id = first.tossup_id AND buzzpoints_buzz.buzz_position = first.buzz_position AND first.row_num = 1 AND buzzpoints_buzz.value > 0
    LEFT JOIN   buzz_ranks top_three ON buzzpoints_buzz.tossup_id = top_three.tossup_id AND buzzpoints_buzz.buzz_position = top_three.buzz_position AND top_three.row_num <= 3 AND buzzpoints_buzz.value > 0
    LEFT JOIN	buzzpoints_buzz neg ON buzzpoints_buzz.game_id = neg.game_id AND buzzpoints_buzz.tossup_id = neg.tossup_id AND buzzpoints_buzz.value > 0 AND neg.value < 0
    WHERE	buzzpoints_tournament.id = $2
    AND	exclude_from_individual = 0
    group by buzzpoints_team.name, buzzpoints_team.slug, buzzpoints_tournament.slug
`;