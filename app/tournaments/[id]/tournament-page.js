"use client";

import StandingsTable from "../../../components/standings_table";
import _ from "lodash";
import { slugify, sanitize } from "../../../lib/utils";
import PlayerTable from "../../../components/player_table";
import TournamentNavRow from "../../../components/tournament-nav-row";
import { Suspense } from "react";

export default function Tournament({ result }) {
  const data = result.props.result;
  const tournament_id = data.Summary[0].tournament_id;

  data.Standings.map((item) => {
    item.team_slug = slugify(sanitize(item.team));
    return item;
  });
  data.Players.map((item) => {
    item.team_slug = slugify(sanitize(item.team));
    item.player_slug = slugify(sanitize(item.player));
    return item;
  });

  let player_lookup = {};
  const player_names = _.map(data.Players, "raw_player");
  const player_slugs = _.map(data.Players, "slug");
  player_names.forEach((k, i) => {
    player_lookup[k] = player_slugs[i];
  });

  return (
    <>
      <div className="main-container">
        <div className="main-content">
          <h1 className="page-title">{data.Summary[0]["tournament_name"]}</h1>
          <p className="page-subtitle">
            {data.Summary[0]["date"].toLocaleDateString("en-US")}
          </p>
          {data.Summary[0]["naqt_id"] ? (
            <p className="naqt-disclaimer">
              These results are NAQT's property, provided for research purposes
              only, and are not to be posted elsewhere without NAQT's
              permission. Results may also be accessed on NAQT's website{" "}
              <a
                href={`https://www.naqt.com/stats/tournament/standings.jsp?tournament_id=${data.Summary[0]["naqt_id"]}`}
              >
                here
              </a>
              .
            </p>
          ) : (
            <></>
          )}
          <Suspense>
            <TournamentNavRow id={tournament_id} />
            <h2 id="standings">Standings</h2>
            <StandingsTable
              id={tournament_id}
              grouping_column="bracket"
              data={data.Standings}
            />
            <br></br>
            <h2 id="players">Players</h2>
            <PlayerTable
              id={tournament_id}
              data={data.Players}
              itemsPerPage={10}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
