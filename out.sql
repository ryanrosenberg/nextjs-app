ALTER TABLE "champions" 
  ALTER COLUMN "year" TYPE varchar,
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "tournament" TYPE varchar,
  ALTER COLUMN "school" TYPE varchar,
  ALTER COLUMN "team" TYPE varchar,
  ALTER COLUMN "team_id" TYPE varchar,
  ADD PRIMARY KEY ("tournament", "year")
;

ALTER TABLE "sets" 
  ALTER COLUMN "set_id" TYPE integer USING (set_id::integer),
  ALTER COLUMN "year" TYPE varchar,
  ALTER COLUMN "set" TYPE varchar,
  ALTER COLUMN "set_name" TYPE varchar,
  ALTER COLUMN "difficulty" TYPE varchar,
  ALTER COLUMN "has_powers" TYPE varchar,
  ALTER COLUMN "default_tuh" TYPE integer,
  ALTER COLUMN "set_slug" TYPE varchar,
  ALTER COLUMN "found" TYPE varchar,
  ADD PRIMARY KEY ("set_id")
;

ALTER TABLE "tournaments" 
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "set_id" TYPE integer,
  ALTER COLUMN "site_id" TYPE integer,
  ALTER COLUMN "date" TYPE date USING (date::date),
  ALTER COLUMN "online" TYPE varchar,
  ALTER COLUMN "nationals" TYPE varchar,
  ALTER COLUMN "tournament_name" TYPE varchar,
  ALTER COLUMN "naqt_id" TYPE integer,
  ADD PRIMARY KEY ("tournament_id")
;

ALTER TABLE "sites" 
  ALTER COLUMN "site_id" TYPE integer,
  ALTER COLUMN "site" TYPE varchar,
  ALTER COLUMN "is_school" TYPE integer,
  ALTER COLUMN "school_id" TYPE integer,
  ALTER COLUMN "lat" TYPE numeric,
  ALTER COLUMN "lon" TYPE numeric,
  ALTER COLUMN "school" TYPE varchar,
  ALTER COLUMN "state" TYPE varchar,
  ALTER COLUMN "region" TYPE varchar,
  ALTER COLUMN "circuit" TYPE varchar,
  ALTER COLUMN "circuit_slug" TYPE varchar,
  ADD PRIMARY KEY ("site_id")
;

ALTER TABLE "tournament_results" 
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "team_id" TYPE varchar,
  ALTER COLUMN "tupptuh" TYPE numeric,
  ALTER COLUMN "bhptuh" TYPE numeric,
  ALTER COLUMN "PPB" TYPE numeric,
  ALTER COLUMN "sos" TYPE numeric,
  ALTER COLUMN "a_value" TYPE numeric,
  ALTER COLUMN "rank" TYPE integer,
  ALTER COLUMN "bracket" TYPE integer,
  ALTER COLUMN "num_teams" TYPE integer
;

ALTER TABLE "schools" 
  ALTER COLUMN "school_id" TYPE integer,
  ALTER COLUMN "school_name" TYPE varchar,
  ALTER COLUMN "slug" TYPE varchar,
  ALTER COLUMN "circuit" TYPE varchar,
  ALTER COLUMN "circuit_slug" TYPE varchar,
  ALTER COLUMN "lon" TYPE numeric,
  ALTER COLUMN "lat" TYPE numeric,
  ALTER COLUMN "open" TYPE varchar,
  ALTER COLUMN "high_school" TYPE varchar,
  ADD PRIMARY KEY ("school_id");

ALTER TABLE "teams" 
  ALTER COLUMN "team_id" TYPE varchar,
  ALTER COLUMN "team" TYPE varchar,
  ALTER COLUMN "school_id" TYPE integer,
  ALTER COLUMN "school" TYPE varchar,
  ADD PRIMARY KEY ("team_id")
;

ALTER TABLE "players" 
  ALTER COLUMN "player_id" TYPE integer,
  ALTER COLUMN "person_id" TYPE integer,
  ADD PRIMARY KEY ("player_id")
;

ALTER TABLE "people" 
  ALTER COLUMN "person_id" TYPE integer,
  ALTER COLUMN "player" TYPE varchar,
  ALTER COLUMN "fname" TYPE varchar,
  ALTER COLUMN "lname" TYPE varchar,
  ALTER COLUMN "slug" TYPE varchar,
  ALTER COLUMN "schools" TYPE varchar,
  ADD PRIMARY KEY ("person_id")
;

ALTER TABLE "editors" 
  ALTER COLUMN "set_id" TYPE integer USING (set_id::integer),
  ALTER COLUMN "person_id" TYPE integer,
  ALTER COLUMN "headitor" TYPE varchar,
  ALTER COLUMN "editor" TYPE varchar,
  ALTER COLUMN "category" TYPE varchar,
  ALTER COLUMN "subcategory" TYPE varchar
;

ALTER TABLE "games" 
  ALTER COLUMN "game_id" TYPE integer,
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "round" TYPE varchar,
  ALTER COLUMN "game_num" TYPE integer,
  ADD PRIMARY KEY ("game_id")
;

ALTER TABLE "team_games" 
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "set_id" TYPE integer USING (set_id::integer),
  ALTER COLUMN "site_id" TYPE integer,
  ALTER COLUMN "school_id" TYPE integer,
  ALTER COLUMN "team_id" TYPE varchar,
  ALTER COLUMN "game_id" TYPE integer,
  ALTER COLUMN "round" TYPE varchar,
  ALTER COLUMN "game_num" TYPE integer,
  ALTER COLUMN "tuh" TYPE integer,
  ALTER COLUMN "prov_team" TYPE varchar,
  ALTER COLUMN "opponent" TYPE varchar,
  ALTER COLUMN "opponent_id" TYPE varchar,
  ALTER COLUMN "result" TYPE numeric,
  ALTER COLUMN "powers" TYPE integer,
  ALTER COLUMN "tens" TYPE integer,
  ALTER COLUMN "negs" TYPE integer,
  ALTER COLUMN "tu_pts" TYPE integer,
  ALTER COLUMN "bonuses_heard" TYPE integer,
  ALTER COLUMN "bonus_pts" TYPE integer,
  ALTER COLUMN "total_pts" TYPE integer,
  ALTER COLUMN "opp_pts" TYPE integer
;

ALTER TABLE "player_games" 
  ALTER COLUMN "tournament_id" TYPE integer,
  ALTER COLUMN "set_id" TYPE integer USING (set_id::integer),
  ALTER COLUMN "site_id" TYPE integer,
  ALTER COLUMN "school_id" TYPE integer USING (school_id::integer),
  ALTER COLUMN "team_id" TYPE varchar,
  ALTER COLUMN "game_id" TYPE integer,
  ALTER COLUMN "player_id" TYPE integer,
  ALTER COLUMN "round" TYPE varchar,
  ALTER COLUMN "game_num" TYPE integer,
  ALTER COLUMN "tuh" TYPE integer,
  ALTER COLUMN "opponent" TYPE varchar,
  ALTER COLUMN "opponent_team_id" TYPE varchar,
  ALTER COLUMN "powers" TYPE integer,
  ALTER COLUMN "tens" TYPE integer,
  ALTER COLUMN "negs" TYPE integer,
  ALTER COLUMN "pts" TYPE integer
;

ALTER TABLE "tournaments" ADD FOREIGN KEY ("tournament_id") REFERENCES "champions" ("tournament_id");

ALTER TABLE "teams" ADD FOREIGN KEY ("team_id") REFERENCES "champions" ("team_id");

ALTER TABLE "tournaments" ADD FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id");

ALTER TABLE "tournaments" ADD FOREIGN KEY ("site_id") REFERENCES "sites" ("site_id");

ALTER TABLE "sites" ADD FOREIGN KEY ("school_id") REFERENCES "schools" ("school_id");

ALTER TABLE "tournaments" ADD FOREIGN KEY ("tournament_id") REFERENCES "tournament_results" ("tournament_id");

ALTER TABLE "teams" ADD FOREIGN KEY ("team_id") REFERENCES "tournament_results" ("team_id");

ALTER TABLE "sites_schools" (
  "sites_circuit" TYPE varchar,
  "schools_circuit" TYPE varchar,
  PRIMARY KEY ("sites_circuit", "schools_circuit")
);

ALTER TABLE "sites_schools" ADD FOREIGN KEY ("sites_circuit") REFERENCES "sites" ("circuit");

ALTER TABLE "sites_schools" ADD FOREIGN KEY ("schools_circuit") REFERENCES "schools" ("circuit");


ALTER TABLE "sites_schools(1)" (
  "sites_circuit_slug" TYPE varchar,
  "schools_circuit_slug" TYPE varchar,
  PRIMARY KEY ("sites_circuit_slug", "schools_circuit_slug")
);

ALTER TABLE "sites_schools(1)" ADD FOREIGN KEY ("sites_circuit_slug") REFERENCES "sites" ("circuit_slug");

ALTER TABLE "sites_schools(1)" ADD FOREIGN KEY ("schools_circuit_slug") REFERENCES "schools" ("circuit_slug");


ALTER TABLE "teams" ADD FOREIGN KEY ("school_id") REFERENCES "schools" ("school_id");

ALTER TABLE "teams" ADD FOREIGN KEY ("school") REFERENCES "schools" ("school_name");

ALTER TABLE "players" ADD FOREIGN KEY ("person_id") REFERENCES "people" ("person_id");

ALTER TABLE "editors" ADD FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id");

ALTER TABLE "editors" ADD FOREIGN KEY ("person_id") REFERENCES "people" ("person_id");

ALTER TABLE "tournaments" ADD FOREIGN KEY ("tournament_id") REFERENCES "team_games" ("tournament_id");

ALTER TABLE "team_games" ADD FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id");

ALTER TABLE "team_games" ADD FOREIGN KEY ("site_id") REFERENCES "sites" ("site_id");

ALTER TABLE "team_games" ADD FOREIGN KEY ("school_id") REFERENCES "schools" ("school_id");

ALTER TABLE "team_games" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id");

ALTER TABLE "team_games" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("game_id");

ALTER TABLE "tournaments" ADD FOREIGN KEY ("tournament_id") REFERENCES "player_games" ("tournament_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("set_id") REFERENCES "sets" ("set_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("site_id") REFERENCES "sites" ("site_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("school_id") REFERENCES "schools" ("school_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("team_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("game_id");

ALTER TABLE "player_games" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("player_id");

