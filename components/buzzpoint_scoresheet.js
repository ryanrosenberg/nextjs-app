import styles from "../components/scoresheet.module.css";
import _ from "lodash";

export default function BuzzpointScoresheet({ buzzes, bonuses = null, players }) {
    const tournament_slug = buzzes[0].slug;
    const round_number = buzzes[0].round_number;
    
    const player_teams = _.partition(players, (player) => player.team === players[0].team);

    const team1_name = player_teams[0][0].team;
    const team1_players = player_teams[0].map((player) => player.player);

    const team2_name = player_teams[1][0].team;
    const team2_players = player_teams[1].map((player) => player.player);

    var team1_score = 0;
    var team2_score = 0;
    var tuh = Math.max(...players.map(player => player.tuh));
    return (
        <div className={styles.scoresheet}>
            <div className={styles.teamDiv}>
                <table className={styles.playerNameTable}>
                    <thead className={styles.playerRow}>
                        <tr>
                            {team1_players.map((player, i) => {
                                return (
                                    <th className={styles.playerName} key={`team-one-player-${i}`}>{player}</th>
                                );
                            })}
                            <th key="bonus-1-team-one">B1</th>
                            <th key="bonus-2-team-one">B2</th>
                            <th key="bonus-3-team-one">B3</th>
                            <th>Total</th>
                            <th>
                                <h3>TU</h3>
                            </th>
                            {team2_players.map((player, i) => {
                                return (
                                    <th className={styles.playerName} key={`team-two-player-${i}`}>{player}</th>
                                );
                            })}
                            <th key="bonus-1-team-two">B1</th>
                            <th key="bonus-2-team-two">B2</th>
                            <th key="bonus-3-team-two">B3</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.range(1, tuh + 1).map((i) => {
                            const tu_buzzes = buzzes.filter(buzz => buzz.question_number === String(i));
                            const team1_buzzes = team1_players.map(
                                (player) => (
                                    tu_buzzes.filter(item => item.player === player).length > 0 ?
                                        tu_buzzes.filter(item => item.player === player) :
                                        []))
                            const team2_buzzes = team2_players.map(
                                (player) => (
                                    tu_buzzes.filter(item => item.player === player).length > 0 ?
                                        tu_buzzes.filter(item => item.player === player) :
                                        []))
                            return (
                                <tr key={i}>
                                    {team1_buzzes.map((item, num) => (
                                        item.length > 0 ?
                                            <td className={styles.player} key={`team-one-player-${num}`}>
                                                <span className={item[0].value < 0 ?
                                                    styles.buzzNeg : item[0].value > 10 ? styles.buzzPower : item[0].value > 0 ? styles.buzzGet : ""}>{item[0].value}</span> <span className={styles.buzzPosition}>{item[0].buzz_position}</span></td> :
                                            <td className={styles.player} key={`team-one-player-${num}`}></td>
                                    )).concat(
                                        [1, 2, 3, 4].map(item => <td key={item}></td>)
                                    ).concat(
                                        <td className={styles.tuNumberCell} key='tu'><a href={`/buzzpoints/tournament/${tournament_slug}/tossup/${round_number}/${i}`} className={styles.tuNumber}>{i}</a></td>
                                    ).concat(team2_buzzes.map((item, num) => (
                                        item.length > 0 ?
                                            <td key={`team-two-player-${num}`}>
                                            <span className={item[0].value < 0 ? styles.buzzNeg : item[0].value > 10 ? styles.buzzPower : item[0].value > 0 ? styles.buzzGet : ""}>{item[0].value}</span> <span className={styles.buzzPosition}>{item[0].buzz_position}</span></td> :
                                            <td key={`team-two-player-${num}`}></td>
                                    ))).concat(
                                        [5, 6, 7, 8].map(item => <td key={item}></td>)
                                    )}
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )

    //   return (
    //     <div>
    //       <b>{qbj["packets"]}</b>
    //       <div className={styles.scoresheet}>
    //         <div className={styles.teamDiv}>
    //           <h2>
    //             {team1_name} vs. {team2_name}
    //           </h2>
    //           <table className={styles.playerNameTable}>
    //             <thead className={styles.playerRow}>
    //               <tr>
    //                 {team1_players.map((player) => {
    //                   return (
    //                     <th
    //                       className={styles.playerName}
    //                       dangerouslySetInnerHTML={{
    //                         __html: player.replace(" ", " "),
    //                       }}
    //                     ></th>
    //                   );
    //                 })}
    //                 <th>B1</th>
    //                 <th>B2</th>
    //                 <th>B3</th>
    //                 <th>Total</th>
    //                 <th>
    //                   <h3>TU</h3>
    //                 </th>
    //                 {team2_players.map((player) => {
    //                   return (
    //                     <th
    //                       className={styles.playerName}
    //                       dangerouslySetInnerHTML={{
    //                         __html: player.replace(" ", " "),
    //                       }}
    //                     ></th>
    //                   );
    //                 })}
    //                 <th>B1</th>
    //                 <th>B2</th>
    //                 <th>B3</th>
    //                 <th>Total</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {qbj.match_questions.map((question, i) => {
    //                 const buzzes = Array.from(
    //                   " ".repeat(team1_players.length + 4)
    //                 ).concat(
    //                   [question.question_number],
    //                   Array.from(" ".repeat(team2_players.length + 4))
    //                 );

    //                 question.buzzes.map(function (buzz) {
    //                   team1_players.forEach(function (player, index) {
    //                     if (player == buzz.player.name) {
    //                       buzzes[index] = buzz.result.value;
    //                       if (buzz.result.value == 10) {
    //                         buzzes[team1_players.length] =
    //                           question.bonus.parts[0].controlled_points;
    //                         buzzes[team1_players.length + 1] =
    //                           question.bonus.parts[1].controlled_points;
    //                         buzzes[team1_players.length + 2] =
    //                           question.bonus.parts[2].controlled_points;
    //                       }
    //                     }
    //                   });
    //                   team2_players.forEach(function (player, index) {
    //                     if (player == buzz.player.name) {
    //                       buzzes[index + team1_players.length + 5] =
    //                         buzz.result.value;
    //                       if (buzz.result.value == 10) {
    //                         buzzes[
    //                           team1_players.length + team2_players.length + 5
    //                         ] = question.bonus.parts[0].controlled_points;
    //                         buzzes[
    //                           team1_players.length + team2_players.length + 6
    //                         ] = question.bonus.parts[1].controlled_points;
    //                         buzzes[
    //                           team1_players.length + team2_players.length + 7
    //                         ] = question.bonus.parts[2].controlled_points;
    //                       }
    //                     }
    //                   });
    //                 });

    //                 var team1_cycle = buzzes
    //                   .slice(0, team1_players.length + 2)
    //                   .reduce((partialSum, a) => partialSum + Number(a), 0);
    //                 team1_score += team1_cycle;
    //                 buzzes[team1_players.length + 3] = team1_score;

    //                 var team2_cycle = buzzes
    //                   .slice(team1_players.length + 5, -1)
    //                   .reduce((partialSum, a) => partialSum + Number(a), 0);
    //                 team2_score += team2_cycle;
    //                 buzzes[buzzes.length - 1] = team2_score;

    //                 return (
    //                   <tr>
    //                     {buzzes.map((buzz, index) => {
    //                       if (
    //                         (index == team1_players.length - 1) |
    //                         (index ==
    //                           team1_players.length + team2_players.length + 4)
    //                       ) {
    //                         return <td className={styles.lastPlayer}>{buzz}</td>;
    //                       } else if (
    //                         (index == team1_players.length) |
    //                         (index == team1_players.length + 1) |
    //                         (index ==
    //                           team1_players.length + team2_players.length + 6) |
    //                           (index ==
    //                             team1_players.length + team2_players.length + 5)
    //                       ) {
    //                         if (buzz == 10) {
    //                           return (
    //                             <td className={styles.bonus}>✓</td>
    //                           );
    //                         } else {
    //                           return <td className={styles.bonus}></td>;
    //                         }
    //                       } else if (
    //                         (index == team1_players.length + 2) |
    //                         (index ==
    //                           team1_players.length + team2_players.length + 7)
    //                       ) {
    //                         if (buzz == 10) {
    //                           return (
    //                             <td className={styles.lastBonus}>✓</td>
    //                           );
    //                         } else {
    //                           return <td className={styles.lastBonus}></td>;
    //                         }
    //                       } else if (
    //                         (index == team1_players.length + 3) |
    //                         (index ==
    //                           team1_players.length + team2_players.length + 8)
    //                       ) {
    //                         return <td className={styles.teamTotal}>{buzz}</td>;
    //                       } else if (index == team1_players.length + 4) {
    //                         return <td className={styles.tuNumberCell}><p className={styles.tuNumber}>{buzz}</p><RawHtml html={packet.tossups[i]['answer'].split(' [')[0].split(' (')[0]} /></td>;
    //                       } else {
    //                         return <td>{buzz}</td>;
    //                       }
    //                     })}
    //                   </tr>
    //                 );
    //               })}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   );
}