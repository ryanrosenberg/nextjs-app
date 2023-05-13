import styles from "../components/scoresheet.module.css";
import _ from "lodash";

export default function Scoresheet({ qbj, packet }) {
  const team1_name = qbj.match_teams[0].team.name;
  const team1_players = qbj.match_teams[0].match_players.map(function (
    player
  ) {
    return player["player"]["name"];
  });
  
  const team2_name = qbj.match_teams[1].team.name;
  const team2_players = qbj.match_teams[1].match_players.map(function (
    player
  ) {
    return player["player"]["name"];
  });

  var team1_score = 0;
  var team2_score = 0;

  return (
    <div>
      <b>{qbj["packets"]}</b>
      <div className={styles.scoresheet}>
        <div className={styles.teamDiv}>
          <h2>
            {team1_name} vs. {team2_name}
          </h2>
          <table className={styles.playerNameTable}>
            <thead className={styles.playerRow}>
              <tr>
                {team1_players.map((player) => {
                  return (
                    <th
                      className={styles.playerName}
                      dangerouslySetInnerHTML={{
                        __html: player.replace(" ", " "),
                      }}
                    ></th>
                  );
                })}
                <th>B1</th>
                <th>B2</th>
                <th>B3</th>
                <th>Total</th>
                <th>
                  <h3>TU</h3>
                </th>
                {team2_players.map((player) => {
                  return (
                    <th
                      className={styles.playerName}
                      dangerouslySetInnerHTML={{
                        __html: player.replace(" ", " "),
                      }}
                    ></th>
                  );
                })}
                <th>B1</th>
                <th>B2</th>
                <th>B3</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {qbj.match_questions.map((question) => {
                const buzzes = Array.from(
                  " ".repeat(team1_players.length + 4)
                ).concat(
                  [question.question_number],
                  Array.from(" ".repeat(team2_players.length + 4))
                );

                question.buzzes.map(function (buzz) {
                  team1_players.forEach(function (player, index) {
                    if (player == buzz.player.name) {
                      buzzes[index] = buzz.result.value;
                      if (buzz.result.value == 10) {
                        buzzes[team1_players.length] =
                          question.bonus.parts[0].controlled_points;
                        buzzes[team1_players.length + 1] =
                          question.bonus.parts[1].controlled_points;
                        buzzes[team1_players.length + 2] =
                          question.bonus.parts[2].controlled_points;
                      }
                    }
                  });
                  team2_players.forEach(function (player, index) {
                    if (player == buzz.player.name) {
                      buzzes[index + team1_players.length + 5] =
                        buzz.result.value;
                      if (buzz.result.value == 10) {
                        buzzes[
                          team1_players.length + team2_players.length + 5
                        ] = question.bonus.parts[0].controlled_points;
                        buzzes[
                          team1_players.length + team2_players.length + 6
                        ] = question.bonus.parts[1].controlled_points;
                        buzzes[
                          team1_players.length + team2_players.length + 7
                        ] = question.bonus.parts[2].controlled_points;
                      }
                    }
                  });
                });

                var team1_cycle = buzzes
                  .slice(0, team1_players.length + 2)
                  .reduce((partialSum, a) => partialSum + Number(a), 0);
                team1_score += team1_cycle;
                buzzes[team1_players.length + 3] = team1_score;

                var team2_cycle = buzzes
                  .slice(team1_players.length + 5, -1)
                  .reduce((partialSum, a) => partialSum + Number(a), 0);
                team2_score += team2_cycle;
                buzzes[buzzes.length - 1] = team2_score;
                
                return (
                  <tr>
                    {buzzes.map((buzz, index) => {
                      if (
                        (index == team1_players.length - 1) |
                        (index ==
                          team1_players.length + team2_players.length + 4)
                      ) {
                        return <td className={styles.lastPlayer}>{buzz}</td>;
                      } else if (
                        (index == team1_players.length) |
                        (index == team1_players.length + 1) |
                        (index ==
                          team1_players.length + team2_players.length + 6) |
                          (index ==
                            team1_players.length + team2_players.length + 5)
                      ) {
                        if (buzz == 10) {
                          return (
                            <td className={styles.bonus}>✓</td>
                          );
                        } else {
                          return <td className={styles.bonus}></td>;
                        }
                      } else if (
                        (index == team1_players.length + 2) |
                        (index ==
                          team1_players.length + team2_players.length + 7)
                      ) {
                        if (buzz == 10) {
                          return (
                            <td className={styles.lastBonus}>✓</td>
                          );
                        } else {
                          return <td className={styles.lastBonus}></td>;
                        }
                      } else if (
                        (index == team1_players.length + 3) |
                        (index ==
                          team1_players.length + team2_players.length + 8)
                      ) {
                        return <td className={styles.teamTotal}>{buzz}</td>;
                      } else if (index == team1_players.length + 4) {
                        return <td className={styles.tuNumber}>{buzz}</td>;
                      } else {
                        return <td>{buzz}</td>;
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
